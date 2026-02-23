import { useCallback, useRef } from 'react';
import { useScanningStore } from '../../store/useScanningStore';
import { useScanning } from '../../hooks/useScanning';
import styles from '../../styles/Scanning.module.css';

/**
 * 전체화면 터치 오버레이 (자동 모드 전용)
 * - 짧은 터치 = 선택
 * - 꾹 누르기 (1.5초) = 취소 (이전 단계로)
 */
export default function ScanningOverlay() {
  const isActive = useScanningStore((s) => s.isActive);
  const phase = useScanningStore((s) => s.phase);
  const { selectCurrent, goBack } = useScanning();
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    didLongPress.current = false;

    // 1.5초 꾹 누르면 취소 (이전 단계로)
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      goBack();
    }, 1500);
  }, [goBack]);

  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearLongPress();

    if (didLongPress.current) return; // 꾹 눌러서 이미 취소됨

    if (navigator.vibrate) navigator.vibrate(30);
    selectCurrent(); // 짧은 터치 = 선택
  }, [selectCurrent, clearLongPress]);

  const handleCancel = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearLongPress();
    if (navigator.vibrate) navigator.vibrate(50);
    goBack();
  }, [goBack, clearLongPress]);

  if (!isActive) return null;

  return (
    <>
      {/* 전체화면 터치 영역 */}
      <div
        className={styles.touchZone}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      />

      {/* 하단 힌트 + 취소 버튼 */}
      <div className={styles.overlay}>
        {phase !== 'menu' && (
          <button
            className={styles.btnNext}
            onTouchEnd={handleCancel}
            onClick={handleCancel}
            type="button"
          >
            ← 취소
          </button>
        )}
        <div className={styles.touchHint}>
          터치 = 선택 · 꾹 누르기 = 취소
        </div>
      </div>
    </>
  );
}
