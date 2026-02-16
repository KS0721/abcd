import { useCallback, useRef } from 'react';
import { useScanningStore } from '../../store/useScanningStore';
import { useScanning } from '../../hooks/useScanning';
import styles from '../../styles/Scanning.module.css';

/**
 * 전체화면 터치 오버레이
 * - 자동 모드: 터치 = 선택
 * - 단계별 모드: 터치 = 다음, 길게 누르기(1초) = 선택
 * - 취소 버튼은 항상 표시 (메뉴 단계 제외)
 */
export default function ScanningOverlay() {
  const isActive = useScanningStore((s) => s.isActive);
  const method = useScanningStore((s) => s.config.method);
  const phase = useScanningStore((s) => s.phase);
  const { moveNext, selectCurrent, goBack } = useScanning();
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  // 터치/클릭 시작 (길게 누르기 감지용)
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    didLongPress.current = false;

    if (method === 'step') {
      // 단계별: 1초 누르면 선택
      longPressTimer.current = setTimeout(() => {
        didLongPress.current = true;
        if (navigator.vibrate) navigator.vibrate(100);
        selectCurrent();
      }, 1000);
    }
  }, [method, selectCurrent]);

  // 터치/클릭 끝
  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearLongPress();

    if (didLongPress.current) return; // 길게 누르기로 이미 선택됨

    if (navigator.vibrate) navigator.vibrate(30);

    if (method === 'auto') {
      selectCurrent(); // 자동: 터치 = 선택
    } else {
      moveNext(); // 단계별: 짧은 터치 = 다음
    }
  }, [method, selectCurrent, moveNext, clearLongPress]);

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
          {method === 'auto'
            ? '화면을 터치하면 선택'
            : '터치 = 다음 · 길게 누르기 = 선택'}
        </div>
      </div>
    </>
  );
}
