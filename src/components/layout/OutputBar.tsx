import { useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import styles from '../../styles/OutputBar.module.css';

export default function OutputBar() {
  const currentMessage = useAppStore((s) => s.currentMessage);
  const selectedCards = useAppStore((s) => s.selectedCards);
  const clearSelection = useAppStore((s) => s.clearSelection);
  const addToHistory = useAppStore((s) => s.addToHistory);
  const openListenerModal = useAppStore((s) => s.openListenerModal);

  const hasMessage = currentMessage.length > 0;

  const handleSpeak = useCallback(() => {
    if (!hasMessage) return;
    // TTS는 useTTS 훅에서 처리 (Phase 6에서 구현)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentMessage);
      utterance.lang = 'ko-KR';
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
    addToHistory(currentMessage);
  }, [currentMessage, hasMessage, addToHistory]);

  const handleShow = useCallback(() => {
    if (!hasMessage) return;
    openListenerModal(currentMessage, false, selectedCards);
    addToHistory(currentMessage);
  }, [currentMessage, hasMessage, selectedCards, openListenerModal, addToHistory]);

  const handleClear = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return (
    <div className={styles.bar}>
      <div className={styles.textArea}>
        {hasMessage ? (
          <span className={styles.text}>{currentMessage}</span>
        ) : (
          <span className={`${styles.text} ${styles.empty}`}>카드를 선택하세요</span>
        )}
      </div>

      <div className={styles.buttons}>
        <button
          className={styles.btnSpeak}
          onClick={handleSpeak}
          disabled={!hasMessage}
          aria-label="말하기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </button>

        <button
          className={styles.btnShow}
          onClick={handleShow}
          disabled={!hasMessage}
          aria-label="크게보기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>

        <button
          className={styles.btnClear}
          onClick={handleClear}
          aria-label="지우기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  );
}
