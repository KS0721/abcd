// ========================================
// HistoryScreen.tsx - 의사소통 기록 화면
//
// 연구 근거:
// - Higginbotham & Wilkins (1999): 의사소통 이력으로 반복 발화 속도 50%↑
// - Light & McNaughton (2014): AAC 사용자 발화의 70%가 반복적
//
// 🤖 AI TODO [기록 분석 + 자동 추천]
// ─────────────────────────────────────
// 역할: LLM이 기록 데이터를 분석하여 사용자의 의사소통 패턴을 학습
//
// 입력: history[] (최근 100개 발화 문장)
// 처리:
//   1. 빈도 분석 → 자주 쓰는 문장 TOP 10 추출
//   2. 시간대별 패턴 → 아침에 "배고파요" 자주 사용 → 아침 시간에 자동 추천
//   3. 연속 패턴 → "안녕하세요" 다음에 "이름이 뭐예요?" 자주 옴 → 다음 문장 예측
//   4. 상황 추론 → "주사", "아파요" 연속 → 병원 상황판 자동 전환 제안
// 출력: suggestedPhrases[] (추천 문장 3~5개)
//
// LLM 프롬프트 예시:
//   "다음은 AAC 사용자의 최근 발화 기록입니다: [...].
//    현재 시간은 {time}입니다.
//    사용자가 다음에 말할 가능성이 높은 문장 3개를 추천하세요.
//    짧고 실용적인 문장을 우선하세요."
//
// 논문 근거:
// - Valencia et al. (2023, CHI): LLM이 AAC 사용자 의사소통 속도/다양성 향상
// - Shen et al. (2022, ASSETS): 언어모델 기반 문장 예측 실시간 성능 검증
// ========================================

import { useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTTS } from '../../hooks/useTTS';

export default function HistoryScreen() {
  const history = useAppStore((s) => s.history);
  const clearHistory = useAppStore((s) => s.clearHistory);
  const showConfirm = useAppStore((s) => s.showConfirm);
  const { speak } = useTTS();

  const handleClear = useCallback(async () => {
    const confirmed = await showConfirm('모든 기록을 삭제할까요?');
    if (confirmed) clearHistory();
  }, [showConfirm, clearHistory]);

  const sectionStyle: React.CSSProperties = {
    padding: 'var(--spacing-md)',
    background: 'var(--color-surface)',
  };

  const itemStyle: React.CSSProperties = {
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderBottom: '1px solid var(--color-border)',
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{
        padding: 'var(--spacing-md)', background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>기록</h2>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            style={{
              padding: '8px 14px', border: 'none', borderRadius: '6px',
              cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 600,
              background: 'var(--color-danger)', color: 'white',
            }}
          >
            전체 삭제
          </button>
        )}
      </div>

      {/* 🤖 AI TODO: 여기에 AI 추천 문장 섹션 추가
          <AISuggestedPhrases history={history} /> 컴포넌트
          LLM 분석 결과로 "다음에 말할 문장" 3~5개를 카드 형태로 표시
          터치 시 즉시 TTS 발화 + OutputBar에 설정 */}

      <div style={sectionStyle}>
        {history.length === 0 ? (
          <p style={{
            textAlign: 'center', color: 'var(--color-text-muted)',
            padding: 'var(--spacing-xl) 0', fontSize: 'var(--font-size-base)',
          }}>
            아직 기록이 없습니다
          </p>
        ) : (
          history.map((msg, index) => (
            <div
              key={index}
              style={itemStyle}
              onClick={() => speak(msg)}
            >
              {msg}
            </div>
          ))
        )}
      </div>

      <div style={{
        padding: 'var(--spacing-md)', textAlign: 'center',
        color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)',
      }}>
        문장을 터치하면 다시 읽어줍니다
      </div>
    </div>
  );
}
