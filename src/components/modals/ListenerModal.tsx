import { useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useScanHighlight } from '../../hooks/useScanning';
import styles from '../../styles/Modal.module.css';
import scanStyles from '../../styles/Scanning.module.css';

export default function ListenerModal() {
  const { isOpen, message, isEmergency } = useAppStore((s) => s.listenerModal);
  const closeListenerModal = useAppStore((s) => s.closeListenerModal);
  const clearSelection = useAppStore((s) => s.clearSelection);
  const highlighted = useScanHighlight('modal', 0);

  const handleClose = useCallback(() => {
    closeListenerModal();
    clearSelection();
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }, [closeListenerModal, clearSelection]);

  // 자동 TTS
  useEffect(() => {
    if (isOpen && message && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'ko-KR';
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }, [isOpen, message]);

  // ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.listenerModal} ${isEmergency ? styles.emergency : ''}`}>
      {/* 상단 라벨 */}
      {isEmergency && (
        <div className={styles.emergencyLabel}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
          긴급 상황
        </div>
      )}

      <button
        className={`${styles.listenerClose} ${isEmergency ? styles.emergencyClose : ''} ${highlighted ? scanStyles.highlightClose : ''}`}
        onClick={handleClose}
        aria-label="닫기"
        data-scan-phase="modal"
        data-scan-index={0}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div className={`${styles.listenerText} ${isEmergency ? styles.emergencyText : ''}`}>
        {message}
      </div>

      {/* 하단 안내 */}
      <div className={styles.listenerHint}>
        {isEmergency ? '이 화면을 주변 사람에게 보여주세요' : '화면을 터치하거나 닫기를 눌러주세요'}
      </div>
    </div>
  );
}
