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

  // ESC로 닫기 (스캐닝 중이 아닐 때만 - 스캐닝은 useScanning에서 ESC 처리)
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
      <button
        className={`${styles.listenerClose} ${highlighted ? scanStyles.highlightClose : ''}`}
        onClick={handleClose}
        aria-label="닫기"
        data-scan-phase="modal"
        data-scan-index={0}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div className={styles.listenerText}>{message}</div>
    </div>
  );
}
