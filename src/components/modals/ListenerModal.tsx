import { useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useScanningStore } from '../../store/useScanningStore';
import { useScanHighlight } from '../../hooks/useScanning';
import styles from '../../styles/Modal.module.css';
import scanStyles from '../../styles/Scanning.module.css';

export default function ListenerModal() {
  const { isOpen, message, isEmergency } = useAppStore((s) => s.listenerModal);
  const closeListenerModal = useAppStore((s) => s.closeListenerModal);
  const clearSelection = useAppStore((s) => s.clearSelection);
  const isScanning = useScanningStore((s) => s.isActive);
  const highlighted = useScanHighlight('modal', 0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    closeListenerModal();
    clearSelection();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }, [closeListenerModal, clearSelection]);

  // TTS 루프
  useEffect(() => {
    if (!isOpen || !message || !('speechSynthesis' in window)) return;

    // 일반 모달: 1회 재생
    if (!isEmergency) {
      const u = new SpeechSynthesisUtterance(message);
      u.lang = 'ko-KR';
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
      return;
    }

    // 긴급 모달: 3회 반복 → 5초 대기 → 3회 반복 ... (닫기 전까지 무한)
    let stopped = false;

    const runCycle = () => {
      let count = 0;

      const speakNext = () => {
        if (stopped) return;
        count++;
        const u = new SpeechSynthesisUtterance(message);
        u.lang = 'ko-KR';
        u.rate = 0.88;
        u.volume = 1;
        u.onend = () => {
          if (stopped) return;
          if (count < 3) {
            // 1.3초 후 다음 발화
            timerRef.current = setTimeout(speakNext, 1300);
          } else {
            // 3회 완료 → 5초 후 다음 사이클
            timerRef.current = setTimeout(runCycle, 5000);
          }
        };
        u.onerror = () => {
          // 에러 시에도 다음 사이클 계속
          if (!stopped) timerRef.current = setTimeout(runCycle, 3000);
        };
        speechSynthesis.speak(u);
      };

      speechSynthesis.cancel();
      speakNext();
    };

    runCycle();

    return () => {
      stopped = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      speechSynthesis.cancel();
    };
  }, [isOpen, message, isEmergency]);

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

      {/* 스캐닝 중엔 X 버튼 숨김 */}
      {!isScanning && (
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
      )}

      <div className={`${styles.listenerText} ${isEmergency ? styles.emergencyText : ''}`}>
        {message}
      </div>

      {/* 하단 안내 */}
      <div className={styles.listenerHint}>
        {isEmergency
          ? '이 화면을 주변 사람에게 보여주세요'
          : isScanning
            ? '터치하면 닫힙니다'
            : '화면을 터치하거나 닫기를 눌러주세요'}
      </div>
    </div>
  );
}
