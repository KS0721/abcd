import { useEffect, useCallback, useRef } from 'react';
import { useUIStore } from '../../store/useUIStore.ts';
import { useSentenceStore } from '../../../domains/sentence/store/useSentenceStore.ts';
import { useScanningStore } from '../../../domains/scanning/store/useScanningStore.ts';
import { useScanHighlight } from '../../../domains/scanning/hooks/useScanning.ts';
import { getImageById, getFallbackSvg } from '../../../infrastructure/arasaac/arasaac.ts';
import styles from '../../styles/Modal.module.css';
import scanStyles from '../../styles/Scanning.module.css';

/** Web Speech API 직접 호출 — 즉시 발화, 지연 없음 */
function speakDirect(text: string, rate = 1.0) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = rate;
  speechSynthesis.speak(u);
}

export default function ListenerModal() {
  const { isOpen, message, isEmergency, cards, withSpeech } = useUIStore((s) => s.listenerModal);
  const closeListenerModal = useUIStore((s) => s.closeListenerModal);
  const clearSelection = useSentenceStore((s) => s.clearSelection);
  const isScanning = useScanningStore((s) => s.isActive);
  const highlighted = useScanHighlight('modal', 0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    closeListenerModal();
    clearSelection();
  }, [closeListenerModal, clearSelection]);

  // TTS (withSpeech가 true일 때만)
  useEffect(() => {
    if (!isOpen || !message || !withSpeech) return;

    // 일반 모드: 즉시 1회 재생, 모달은 X 누를 때까지 유지
    if (!isEmergency) {
      speakDirect(message);
      return () => {
        if ('speechSynthesis' in window) speechSynthesis.cancel();
      };
    }

    // 긴급 모달: 반복 발화
    let stopped = false;
    let count = 0;

    const speakNext = () => {
      if (stopped) return;
      speakDirect(message, 0.9);
      count++;
      // 3회 발화 후 5초 대기, 그 후 다시 3회
      const delay = count % 3 === 0 ? 5000 : 1300;
      timerRef.current = setTimeout(speakNext, delay + message.length * 150);
    };

    speakNext();

    return () => {
      stopped = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    };
  }, [isOpen, message, isEmergency, withSpeech]);

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
