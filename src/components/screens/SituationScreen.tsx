// ========================================
// SituationScreen.tsx - 상황별 어휘판 화면
//
// 현재: 20개 상황판(집, 병원, 식당, 학교 등) 수동 선택
//
// 🤖 AI TODO [상황 자동 감지 + 동적 상황판 - AI 통합 지점 #4]
// ─────────────────────────────────────────────────────────────
//
// ■ 역할: LLM이 사용자의 위치, 시간, 대화 문맥을 종합하여
//   현재 상황을 자동으로 감지하고, 해당 상황에 최적화된 어휘를 추천
//   → 20개 상황판 중 수동 선택할 필요 없이, 알맞은 상황판이 자동으로 열림
//
// ■ 입력 (LLM에게 전달할 데이터):
//   1. recentHistory: string[]     — 최근 10개 발화 (대화 맥락)
//   2. timeOfDay: string           — 현재 시간 (HH:MM)
//   3. dayOfWeek: string           — 요일
//   4. gpsLocation?: {lat, lng}    — GPS 좌표 (선택적, 사용자 동의 시)
//   5. sttContext?: string[]       — STT로 인식한 상대방 발화 (대화 상황 파악)
//   6. previousSituation?: string  — 직전에 사용한 상황판
//
// ■ 처리 (LLM이 수행할 작업):
//   1. 위치 기반 추론 (GPS 사용 시):
//      - 병원 근처 GPS → "병원" 상황판 자동 추천
//      - 식당 근처 GPS → "식당" 상황판 자동 추천
//   2. 시간 기반 추론:
//      - 아침 7시 + 평일 → "집" 또는 "학교" 추천
//      - 점심 12시 → "식당" 추천
//      - 저녁 9시 → "집" + "목욕" 추천
//   3. 대화 문맥 기반 추론:
//      - 최근 발화에 "아파요", "약" → "병원" 또는 "약국" 추천
//      - 최근 발화에 "먹어요", "배고파요" → "식당" 추천
//      - 상대방(STT)이 "뭐 먹을래?" → "식당" 또는 "카페" 추천
//   4. 동적 상황판 생성:
//      - 기존 20개 상황판에 없는 상황 감지 시, LLM이 임시 상황판 생성
//      - 예) 생일 파티 → {"name": "생일", "cards": ["축하해요", "선물", "케이크", ...]}
//
// ■ 출력:
//   suggestedSituation: {
//     situationId: SituationId;        // 추천 상황판 ID
//     confidence: number;              // 신뢰도 (0~1)
//     reason: string;                  // 추천 이유
//   }
//   // 또는 동적 상황판:
//   dynamicBoard?: {
//     name: string;
//     emoji: string;
//     cards: SituationCard[];
//   }
//
// ■ LLM 프롬프트 예시:
//   ```
//   당신은 AAC 앱의 상황 감지 AI입니다.
//   말을 못하는 사용자의 현재 상황을 파악하여 적절한 어휘판을 추천합니다.
//
//   현재 정보:
//   - 시간: 2024년 3월 15일 오후 2시 (금요일)
//   - 최근 발화: ["선생님", "공부해요", "화장실 가고 싶어요"]
//   - 상대방 발화(STT): ["잠깐만 기다려", "수업 끝나면 가자"]
//
//   사용 가능한 상황판: home, hospital, restaurant, school, daycare, car, park,
//     mart, bath, cafe, dental, hairsalon, exercise, travel, cinema, library,
//     pool, pharmacy, workplace, play
//
//   JSON 형식으로 응답:
//   {"situationId": "school", "confidence": 0.95, "reason": "수업 관련 대화 중"}
//   ```
//
// ■ UI 변경 계획:
//   - 상단에 "AI 추천 상황" 배너 추가 (예: "지금 학교에 있는 것 같아요 → 학교 열기")
//   - 자주 사용하는 상황판을 상단에 자동 배치 (사용 빈도 기반)
//   - 잘 사용하지 않는 상황판은 "더보기"로 접기
//
// ■ 논문 근거:
//   - Schlosser & Koul (2015, Augmentative and Alternative Communication):
//     AAC 상황별 어휘 선택이 의사소통 성공률에 미치는 영향
//   - Beukelman & Light (2020): 상황 기반 AAC 어휘 조직의 임상 가이드라인
//   - Dada & Alant (2009): 문화적 맥락에서의 AAC 상황판 어휘 선정 방법론
//   - Valencia et al. (2023, CHI): LLM의 문맥 인식이 AAC 상황 전환 시간을 60% 단축
// ========================================

import { useCallback } from 'react';
import { SITUATION_BOARDS } from '../../data/cards';
import type { SituationId, Card, SituationCard } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useScanningStore } from '../../store/useScanningStore';
import { useScanHighlight } from '../../hooks/useScanning';
import AACCard from '../cards/AACCard';
import styles from '../../styles/CardGrid.module.css';
import scanStyles from '../../styles/Scanning.module.css';

const SITUATION_IDS = Object.keys(SITUATION_BOARDS) as SituationId[];

/** 스캐닝 하이라이트 적용된 상황 타일 */
function ScannableSituationTile({ index, board, onClick }: {
  index: number;
  board: typeof SITUATION_BOARDS[SituationId];
  onClick: () => void;
}) {
  const highlighted = useScanHighlight('category', index);

  return (
    <button
      onClick={onClick}
      className={highlighted ? scanStyles.highlightTile : undefined}
      data-scan-phase="category"
      data-scan-index={index}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-lg)', background: 'var(--color-surface)',
        border: '2px solid var(--color-border)', borderRadius: '16px',
        cursor: 'pointer', minHeight: '100px',
      }}
    >
      <span style={{ fontSize: '2rem' }}>{board.emoji}</span>
      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{board.name}</span>
    </button>
  );
}

/** 스캐닝 하이라이트 적용된 상황 카드 래퍼 */
function ScannableSituationCard({ index, card, onSelect }: {
  index: number;
  card: SituationCard;
  onSelect: (card: Card) => void;
}) {
  const highlighted = useScanHighlight('card', index);

  return (
    <div
      className={highlighted ? scanStyles.highlightCard : undefined}
      data-scan-phase="card"
      data-scan-index={index}
    >
      <AACCard
        card={{ ...card, category: 'expression' as const }}
        isSelected={false}
        isEditMode={false}
        onSelect={onSelect}
      />
    </div>
  );
}

export default function SituationScreen() {
  // 글로벌 상태 사용 (스캐닝이 제어할 수 있도록)
  const activeSituation = useAppStore((s) => s.activeSituation);
  const setActiveSituation = useAppStore((s) => s.setActiveSituation);
  const selectCard = useAppStore((s) => s.selectCard);
  const isScanning = useScanningStore((s) => s.isActive);

  const handleSituationClick = useCallback((id: SituationId) => {
    setActiveSituation(id);
  }, [setActiveSituation]);

  const handleBack = useCallback(() => {
    setActiveSituation(null);
  }, [setActiveSituation]);

  const handleCardSelect = useCallback((card: Card) => {
    selectCard(card);
  }, [selectCard]);

  // 상황판 카드 보기
  if (activeSituation) {
    const board = SITUATION_BOARDS[activeSituation as SituationId];
    if (!board) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
          padding: 'var(--spacing-md)', background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          {!isScanning && (
            <button onClick={handleBack} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 600,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              뒤로
            </button>
          )}
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
            {board.emoji} {board.name}
          </h2>
        </div>
        <div className={styles.cardsArea} data-scan-scroll>
          <div className={styles.cardsGrid}>
            {/* 스캐닝 모드: 돌아가기 버튼 */}
            {isScanning && (
              <div
                className={useScanHighlight('card', 0) ? scanStyles.backBtnHighlight : scanStyles.backBtn}
                data-scan-phase="card"
                data-scan-index={0}
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>돌아가기</span>
              </div>
            )}

            {board.cards.map((card, i) => (
              <ScannableSituationCard
                key={card.id}
                index={i + 1}
                card={card}
                onSelect={handleCardSelect}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 상황판 목록
  return (
    <div style={{ flex: 1, overflowY: 'auto' }} data-scan-scroll>
      <div style={{
        padding: 'var(--spacing-md)', background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>상황별 어휘판</h2>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--spacing-md)', padding: 'var(--spacing-md)',
        boxSizing: 'border-box', width: '100%',
      }}>
        {SITUATION_IDS.map((id, i) => {
          const board = SITUATION_BOARDS[id];
          return (
            <ScannableSituationTile
              key={id}
              index={i}
              board={board}
              onClick={() => handleSituationClick(id)}
            />
          );
        })}
      </div>
    </div>
  );
}
