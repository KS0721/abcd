import { useEffect, useCallback, useRef } from 'react';
import { useUIStore } from '../../store/useUIStore.ts';
import { useSentenceStore } from '../../../domains/sentence/store/useSentenceStore.ts';
import { useScanningStore } from '../../../domains/scanning/store/useScanningStore.ts';
import { useScanHighlight } from '../../../domains/scanning/hooks/useScanning.ts';
import { useTTS } from '../../hooks/useTTS.ts';
import { getImageById, getFallbackSvg } from '../../../infrastructure/arasaac/arasaac.ts';
import styles from '../../styles/Modal.module.css';
import scanStyles from '../../styles/Scanning.module.css';

export default function ListenerModal() {
  const { isOpen, message, isEmergency, cards, withSpeech } = useUIStore((s) => s.listenerModal);
  const closeListenerModal = useUIStore((s) => s.closeListenerModal);
  const clearSelection = useSentenceStore((s) => s.clearSelection);
  const isScanning = useScanningStore((s) => s.isActive);
  const highlighted = useScanHighlight('modal', 0);
  const { speak, stop } = useTTS();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    stop();
    closeListenerModal();
    clearSelection();
  }, [closeListenerModal, clearSelection, stop]);

  // TTS (withSpeech가 true일 때만)
  useEffect(() => {
    if (!isOpen || !message || !withSpeech) return;

    // 일반 모드: useTTS로 1회 재생 + 완료 후 자동 닫기
    if (!isEmergency) {
      speak(message, {
        onEnd: () => { handleClose(); },
      });
      return;
    }

    // 긴급 모달: 3회 반복 → 5초 대기 → 3회 반복 (무한)
    let stopped = false;

    const runCycle = () => {
      let count = 0;

      const speakNext = () => {
        if (stopped) return;
        count++;
        speak(message, {
          emergency: true,
          onEnd: () => {
            if (stopped) return;
            if (count < 3) {
              timerRef.current = setTimeout(speakNext, 1300);
            } else {
              timerRef.current = setTimeout(runCycle, 5000);
            }
          },
          onError: () => {
            if (!stopped) timerRef.current = setTimeout(runCycle, 3000);
          },
        });
      };

      stop();
      speakNext();
    };

    runCycle();

    return () => {
      stopped = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      stop();
    };
  }, [isOpen, message, isEmergency, withSpeech, speak, stop, handleClose]);

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

  // 카드에서 이미지 URL 가져오기 (마지막 카드)
  const displayCard = cards.length > 0 ? cards[cards.length - 1] : null;
  const imgUrl = displayCard
    ? (displayCard.pictogramUrl || (displayCard.pictogramId ? getImageById(displayCard.pictogramId) : null) || getFallbackSvg(displayCard.text, displayCard.category))
    : null;

  return (
    <div
      className={`${styles.listenerModal} ${isEmergency ? styles.emergency : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={isEmergency ? '긴급 상황' : '문장 표시'}
      onClick={handleClose}
    >
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
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          aria-label="닫기"
          data-scan-phase="modal"
          data-scan-index={0}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}

      {/* 이미지 + 텍스트 */}
      <div className={styles.listenerContent}>
        {imgUrl && (
          <img
            className={styles.listenerImage}
            src={imgUrl}
            alt={message}
          />
        )}
        <div className={`${styles.listenerText} ${isEmergency ? styles.emergencyText : ''}`}>
          {message}
        </div>
      </div>

      {/* 하단 안내 */}
      <div className={styles.listenerHint}>
        {isEmergency
          ? '이 화면을 주변 사람에게 보여주세요'
          : isScanning
            ? '터치하면 닫힙니다'
            : '화면을 터치하면 닫힙니다'}
      </div>
    </div>
  );
}
