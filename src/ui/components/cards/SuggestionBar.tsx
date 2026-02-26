// ========================================
// SuggestionBar.tsx - 다음 카드 추천 바
//
// 현재: 정적 매핑 기반 추천 (verbSuggestions.ts에서 동사→명사 매핑)
//
// 🤖 AI TODO [스마트 카드 추천 - 핵심 AI 통합 지점 #1]
// ──────────────────────────────────────────────────────
//
// ■ 역할: 사용자가 카드를 선택할 때마다 "다음에 선택할 가능성이 높은 카드"를 실시간 추천
//   현재는 동사 선택 시 관련 명사만 추천하지만, LLM을 통해 모든 카드 선택 시 문맥 기반 추천 가능
//
// ■ 입력 (LLM에게 전달할 데이터):
//   1. selectedCards: Card[]           — 현재 선택된 카드 배열 (문장 구성 중인 카드들)
//   2. currentCategory: CategoryId     — 현재 보고 있는 카테고리
//   3. history: string[]               — 최근 발화 기록 (패턴 학습용)
//   4. timeOfDay: string               — 현재 시간대 (아침/점심/저녁)
//   5. activeSituation: SituationId    — 현재 활성 상황판 (있을 경우)
//   6. allAvailableCards: Card[]       — 전체 카드 목록 (추천 후보)
//
// ■ 처리 (LLM이 수행할 작업):
//   1. 문맥 분석: 선택된 카드들의 의미적 관계 파악
//      예) [나, 배고파요] → 음식 관련 카드 추천 (밥, 빵, 과자)
//      예) [학교] → 학교 관련 동사 추천 (공부해요, 놀아요)
//   2. 이력 패턴: "배고파요" 후에 항상 "밥 먹어요" 선택 → 밥 카드 우선 추천
//   3. 시간대 패턴: 아침 시간 → "아침밥", "학교" 우선
//   4. 문법 보완: 현재 문장에 빠진 문법 요소 추천
//      예) 명사만 있으면 → 동사 추천, 동사만 있으면 → 명사 추천
//   5. 상황 연계: 병원 상황판 사용 중 → 의료 관련 카드 우선
//
// ■ 출력:
//   suggestedCardIds: string[]  — 추천 카드 ID 배열 (최대 5~8개, 확률 높은 순)
//
// ■ LLM 프롬프트 예시:
//   ```
//   당신은 AAC(보완대체의사소통) 앱의 카드 추천 AI입니다.
//   말을 못하는 사용자가 카드를 눌러 의사소통합니다.
//
//   현재 선택된 카드: ["나", "학교"]
//   현재 시간: 오후 3시
//   최근 발화 기록: ["학교 가요", "밥 먹어요", "집에 가고 싶어요"]
//
//   아래 카드 목록에서 사용자가 다음에 선택할 가능성이 높은 카드 5개를 추천하세요.
//   사용 가능한 카드: [가요, 와요, 싫어요, 좋아요, 놀아요, 공부해요, ...]
//
//   규칙:
//   1. 문법적으로 자연스러운 문장이 되는 카드를 우선
//   2. 사용자의 과거 패턴을 반영
//   3. 시간대에 맞는 카드를 우선 (예: 점심시간 → 음식 관련)
//   4. 카드 ID만 배열로 반환: ["a_go", "a_study", ...]
//   ```
//
// ■ 구현 방식:
//   1. 캐시: 동일 입력에 대해 결과 캐시 (카드 선택이 바뀔 때만 재요청)
//   2. 지연시간: 200ms 디바운스 후 LLM 요청 (연속 카드 선택 시 불필요한 요청 방지)
//   3. 폴백: LLM 응답 실패 시 현재 정적 매핑 기반 추천 유지
//   4. 오프라인: 기기 내 경량 모델 or 규칙 기반 폴백
//
// ■ 논문 근거:
//   - Trnka et al. (2009, NAACL): N-gram 언어모델 기반 AAC 단어 예측 → 키 입력 40% 감소
//   - Vertanen & Kristensson (2011, ASSETS): 장애인 사용자 대상 단어 예측 시스템 실증
//   - Valencia et al. (2023, CHI): LLM이 AAC 추천 정확도와 대화 속도를 크게 향상시킴
//   - Cai et al. (2024, Nature Communications): LLM 기반 예측 → ALS 환자 커뮤니케이션 57% 효율 증가
//
// ■ 성능 목표:
//   - 추천 정확도 (Top-5 Hit Rate): 60% 이상
//   - 응답 지연시간: 500ms 이내 (사용자 체감 실시간)
//   - 평균 카드 선택 횟수 감소: 30% 이상 (현재 대비)
// ========================================

import { useMemo, useCallback } from 'react';
import { useSentenceStore } from '../../../domains/sentence/store/useSentenceStore.ts';
import { DEFAULT_CARDS } from '../../../domains/card/data/index.ts';
import type { Card } from '../../../domains/card/models.ts';

// 핵심어휘: 카테고리 이동 없이 항상 접근 가능한 고빈도 단어
// 논문: Banajee et al. (2003) - 핵심어가 일상 대화의 80% 차지
// 논문: Robillard et al. (2014) - 핵심어 접근성이 사용률에 직접 영향
const CORE_WORD_IDS = ['ex_yes', 'ex_no', 'f_good', 'f_bad', 'ex_more', 'ex_not', 'ex_want'];

export default function SuggestionBar() {
  const activeSuggestions = useSentenceStore((s) => s.activeSuggestions);
  const selectedCards = useSentenceStore((s) => s.selectedCards);
  const selectCard = useSentenceStore((s) => s.selectCard);

  // 전체 카드 맵 (한 번만 생성)
  const allCardsMap = useMemo(() => {
    const map = new Map<string, Card>();
    Object.values(DEFAULT_CARDS).forEach((cards) =>
      cards.forEach((c) => map.set(c.id, c))
    );
    return map;
  }, []);

  // 핵심어휘 카드
  const coreWords = useMemo(() =>
    CORE_WORD_IDS
      .map((id) => allCardsMap.get(id))
      .filter((c): c is Card => !!c),
    [allCardsMap]
  );

  // 추천 카드 (activeSuggestions가 있을 때)
  const suggestions = useMemo(() => {
    if (!activeSuggestions) return [];
    const selectedIds = new Set(selectedCards.map((c) => c.id));
    return activeSuggestions
      .map((id) => allCardsMap.get(id))
      .filter((c): c is Card => !!c && !selectedIds.has(c.id));
  }, [activeSuggestions, selectedCards, allCardsMap]);

  const handleClick = useCallback((card: Card) => {
    selectCard(card);
  }, [selectCard]);

  // 추천이 있으면 추천 표시, 없으면 핵심어휘 표시
  const hasSuggestions = suggestions.length > 0;
  const displayCards = hasSuggestions ? suggestions : coreWords;
  const label = hasSuggestions ? '추천' : '핵심';

  return (
    <div data-no-swipe style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-sm)',
      padding: 'var(--spacing-sm) var(--spacing-md)',
      background: hasSuggestions ? 'var(--color-primary-bg)' : 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      overflowX: 'auto',
    }}>
      <span style={{
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        color: hasSuggestions ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
        {displayCards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleClick(card)}
            style={{
              padding: '6px 12px',
              background: 'var(--color-surface)',
              border: `1px solid ${hasSuggestions ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: '20px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 500,
              color: hasSuggestions ? 'var(--color-primary)' : 'var(--color-text-primary)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {card.text}
          </button>
        ))}
      </div>
    </div>
  );
}
