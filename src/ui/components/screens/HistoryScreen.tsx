// ========================================
// HistoryScreen.tsx - 의사소통 기록 화면
//
// 향후: LLM 기반 패턴 학습으로 자주 쓰는 문장 자동 추천 확장 예정
// ========================================

import { useCallback } from 'react';
import { useUserDataStore } from '../../../domains/user-data/store/useUserDataStore.ts';
import { useUIStore } from '../../store/useUIStore.ts';
import { useTTS } from '../../hooks/useTTS.ts';

export default function HistoryScreen() {
  const history = useUserDataStore((s) => s.history);
  const clearHistory = useUserDataStore((s) => s.clearHistory);
  const showConfirm = useUIStore((s) => s.showConfirm);
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
