// ========================================
// QuickPhrasesScreen.tsx - 빠른 문장 화면
//
// 현재: 사용자가 수동으로 등록한 문장 목록 (터치 → TTS 발화)
//
// AI TODO [개인화 문장 생성 + 상황별 자동 추천 - AI 통합 지점 #2]
// ──────────────────────────────────────────────────────────────────
//
// ■ 역할: LLM이 사용자의 의사소통 패턴, 현재 상황, 시간대를 분석하여
//   "지금 이 순간 말할 가능성이 높은 완성 문장"을 자동 생성하여 상단에 표시
//   → 카드를 조합할 필요 없이, 한 번의 터치로 즉시 복잡한 문장 발화 가능
//
// ■ 입력 (LLM에게 전달할 데이터):
//   1. history: string[]                — 최근 100개 발화 기록
//   2. quickPhrases: string[]           — 사용자가 등록한 빠른 문장들
//   3. timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
//   4. dayOfWeek: string                — 요일 (평일 vs 주말 패턴 구분)
//   5. recentContext: string[]          — 최근 5분간 발화 (현재 대화 문맥)
//   6. userProfile: { age?, interests?, commonLocations? }  — 선택적 프로필
//
// ■ 처리 (LLM이 수행할 작업):
//   1. 시간대별 문장 생성:
//      - 아침 7시: "좋은 아침이에요", "아침밥 먹고 싶어요", "오늘 학교 가요"
//      - 점심 12시: "배고파요", "밥 먹으러 가요", "뭐 먹을까요?"
//      - 저녁 6시: "집에 가고 싶어요", "피곤해요", "저녁밥 먹어요"
//   2. 대화 문맥 기반 생성:
//      - 최근 발화가 "안녕하세요" → "만나서 반가워요", "이름이 뭐예요?"
//      - 최근 발화가 "아파요" → "병원에 가고 싶어요", "약 먹을래요", "여기가 아파요"
//   3. 빈도 분석 기반 개인화:
//      - 매일 아침 "화장실 가고 싶어요" 사용 → 해당 시간대에 자동 상단 배치
//      - 학교 시간에 "선생님" 관련 문장 자주 사용 → 학교 시간에 추천
//   4. 새로운 문장 제안:
//      - 사용자가 쓰지 않았지만, 비슷한 패턴의 AAC 사용자들이 자주 쓰는 문장 추천
//      - "다른 사용자들이 이 시간에 자주 쓰는 문장: ~"
//
// ■ 출력:
//   aiSuggestedPhrases: Array<{
//     text: string;       // 추천 문장
//     reason: string;     // 추천 이유 (예: "아침 시간에 자주 사용하는 문장")
//     confidence: number; // 추천 신뢰도 (0~1)
//   }>
//
// ■ LLM 프롬프트 예시:
//   ```
//   당신은 AAC(보완대체의사소통) 앱의 문장 추천 AI입니다.
//   말을 못하는 사용자가 빠르게 의사소통할 수 있도록 완성 문장을 추천합니다.
//
//   사용자 정보:
//   - 현재 시간: 2024년 3월 15일 오전 8시 30분 (월요일)
//   - 최근 발화: ["좋은 아침이에요", "밥 먹어요"]
//   - 자주 쓰는 문장 패턴:
//     아침(7-9시): "학교 가요"(90%), "아침밥 먹어요"(80%)
//     점심(11-13시): "배고파요"(95%), "밥 먹어요"(88%)
//
//   규칙:
//   1. 한국어 존댓말 사용 (~요 체)
//   2. 짧고 실용적인 문장 (15자 이내 권장)
//   3. 사용자의 기존 패턴을 우선 반영
//   4. 5개 문장을 추천, 각각 추천 이유를 한 줄로 설명
//
//   JSON 형식으로 응답:
//   [{"text": "학교 가요", "reason": "월요일 아침 자주 사용", "confidence": 0.92}, ...]
//   ```
//
// ■ UI 변경 계획:
//   - 상단에 "AI 추천" 섹션 추가 (파란 배경, 카드 형태)
//   - 기존 수동 문장 목록은 "내 문장" 섹션으로 분리
//   - AI 추천 문장 터치 → 즉시 TTS + 기록 저장
//   - "이 추천 저장하기" 버튼 → 수동 문장 목록에 추가
//
// ■ 논문 근거:
//   - Trnka & McCoy (2008, ACL): AAC 사용자 대상 개인화 언어 모델 적응 연구
//   - Vertanen et al. (2014, CHI): 운동장애 사용자를 위한 예측 텍스트 입력 최적화
//   - Valencia et al. (2023, CHI): LLM 기반 AAC에서 문맥 인식 문장 생성이 소통 속도 2배 향상
//   - Cai et al. (2024, Nature Communications): 개인화 LLM이 반복 패턴 학습으로 입력 효율 57% 증가
//   - Shen et al. (2022, ASSETS): 대형 언어모델 기반 AAC 문장 예측 실시간 성능 검증
//
// ■ 성능 목표:
//   - AI 추천 적중률: 70% (상위 5개 중 1개 이상 사용)
//   - 응답 시간: 1초 이내 (화면 전환 시 미리 요청)
//   - 일 평균 발화 횟수 증가: 25% 이상
// ========================================

import { useState, useCallback, useMemo } from 'react';
import { useUserDataStore } from '../../../domains/user-data/store/useUserDataStore.ts';
import { useTTS } from '../../hooks/useTTS.ts';
import { getFrequentPhrases } from '../../../domains/user-data/services/usageStatsService.ts';

export default function QuickPhrasesScreen() {
  const quickPhrases = useUserDataStore((s) => s.quickPhrases);
  const addQuickPhrase = useUserDataStore((s) => s.addQuickPhrase);
  const removeQuickPhrase = useUserDataStore((s) => s.removeQuickPhrase);
  const updateQuickPhrase = useUserDataStore((s) => s.updateQuickPhrase);
  const { speak } = useTTS();

  // 빈도순 정렬: 자주 발화한 문장을 상단에 배치
  // 논문: Trnka et al. (2009): 빈도 기반 정렬 → 입력/선택 시간 40% 감소
  // 논문: Light & McNaughton (2014): AAC 사용자 발화의 70%가 반복적 → 빈도 우선이 효율적
  const sortedPhrases = useMemo(() => {
    const freqData = getFrequentPhrases(100);
    const freqMap = new Map(freqData.map((p) => [p.text, p.count]));
    return quickPhrases
      .map((phrase, originalIndex) => ({ phrase, originalIndex, freq: freqMap.get(phrase) || 0 }))
      .sort((a, b) => b.freq - a.freq);
  }, [quickPhrases]);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState('');

  const handleAdd = useCallback(() => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    addQuickPhrase(trimmed);
    setNewText('');
    setIsAdding(false);
  }, [newText, addQuickPhrase]);

  const handleEdit = useCallback((index: number) => {
    setEditIndex(index);
    setEditText(quickPhrases[index]);
  }, [quickPhrases]);

  const handleSaveEdit = useCallback(() => {
    if (editIndex === null) return;
    const trimmed = editText.trim();
    if (!trimmed) return;
    updateQuickPhrase(editIndex, trimmed);
    setEditIndex(null);
    setEditText('');
  }, [editIndex, editText, updateQuickPhrase]);

  const handleDelete = useCallback((index: number) => {
    removeQuickPhrase(index);
    if (editIndex === index) {
      setEditIndex(null);
      setEditText('');
    }
  }, [removeQuickPhrase, editIndex]);

  const sectionStyle: React.CSSProperties = {
    padding: 'var(--spacing-md)',
    background: 'var(--color-surface)',
  };

  const phraseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderBottom: '1px solid var(--color-border)',
  };

  const phraseTextStyle: React.CSSProperties = {
    flex: 1,
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    padding: 'var(--spacing-xs) 0',
  };

  // WCAG 2.5.5: 터치 타겟 최소 44×44px 확보
  const btnStyle: React.CSSProperties = {
    padding: '10px 14px',
    minHeight: '44px',
    minWidth: '44px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 600,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-base)',
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{
        padding: 'var(--spacing-md)', background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
          빠른 문장
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          style={{
            ...btnStyle,
            background: 'var(--color-primary)',
            color: 'white',
            padding: '8px 14px',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          + 추가
        </button>
      </div>

      {isAdding && (
        <div style={{
          ...sectionStyle,
          display: 'flex', gap: 'var(--spacing-sm)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <input
            style={inputStyle}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="새 문장을 입력하세요"
            autoFocus
          />
          <button
            onClick={handleAdd}
            style={{ ...btnStyle, background: 'var(--color-primary)', color: 'white' }}
          >
            저장
          </button>
          <button
            onClick={() => { setIsAdding(false); setNewText(''); }}
            style={{ ...btnStyle, background: 'var(--color-border)', color: 'var(--color-text-primary)' }}
          >
            취소
          </button>
        </div>
      )}

      <div style={sectionStyle}>
        {sortedPhrases.length === 0 ? (
          <p style={{
            textAlign: 'center', color: 'var(--color-text-muted)',
            padding: 'var(--spacing-xl) 0', fontSize: 'var(--font-size-base)',
          }}>
            저장된 문장이 없습니다
          </p>
        ) : (
          sortedPhrases.map(({ phrase, originalIndex }) => (
            <div key={originalIndex} style={phraseStyle}>
              {editIndex === originalIndex ? (
                <>
                  <input
                    style={inputStyle}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    style={{ ...btnStyle, background: 'var(--color-primary)', color: 'white' }}
                  >
                    저장
                  </button>
                  <button
                    onClick={() => { setEditIndex(null); setEditText(''); }}
                    style={{ ...btnStyle, background: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <div
                    style={phraseTextStyle}
                    onClick={() => speak(phrase)}
                  >
                    {phrase}
                  </div>
                  <button
                    onClick={() => handleEdit(originalIndex)}
                    style={{ ...btnStyle, background: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                    aria-label="수정"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(originalIndex)}
                    style={{ ...btnStyle, background: 'var(--color-danger)', color: 'white' }}
                    aria-label="삭제"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{
        padding: 'var(--spacing-md)', textAlign: 'center',
        color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)',
      }}>
        문장을 터치하면 바로 읽어줍니다
      </div>
    </div>
  );
}
