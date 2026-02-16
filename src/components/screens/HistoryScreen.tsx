import { useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function HistoryScreen() {
  const history = useAppStore((s) => s.history);
  const clearHistory = useAppStore((s) => s.clearHistory);

  const handleSpeak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: 'var(--spacing-md)', background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>사용 기록</h2>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            style={{
              padding: '6px 12px', border: '1px solid var(--color-border)',
              borderRadius: '8px', background: 'transparent', cursor: 'pointer',
              fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)',
            }}
          >
            전체 삭제
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-md)' }}>
        {history.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: 'var(--spacing-xl)',
            color: 'var(--color-text-muted)', textAlign: 'center',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: 'var(--spacing-md)' }}>
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <p>아직 사용 기록이 없어요</p>
          </div>
        ) : (
          history.map((msg, i) => (
            <button
              key={`${msg}-${i}`}
              onClick={() => handleSpeak(msg)}
              style={{
                display: 'flex', alignItems: 'center', width: '100%',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: '10px', marginBottom: 'var(--spacing-xs)',
                cursor: 'pointer', textAlign: 'left',
                fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', flexShrink: 0, color: 'var(--color-primary)' }}>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              </svg>
              {msg}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
