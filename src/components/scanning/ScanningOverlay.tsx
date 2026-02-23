import { useCallback, useRef } from 'react';
import { useScanningStore } from '../../store/useScanningStore';
import { useScanning } from '../../hooks/useScanning';
import styles from '../../styles/Scanning.module.css';

const DOUBLE_TAP_DELAY = 400; // ms
const LONG_PRESS_DELAY = 1500; // ms

/**
 * 전체화면 터치 오버레이
 * - 짧은 터치 = 선택
 * - 꾹 누르기 (1.5초) = 스캐닝 끄기
 * - 두번터치 (400ms 이내) = 화면 이동
 */
export default function ScanningOverlay() {
  const isActive = useScanningStore((s) => s.isActive);
  const { selectCurrent, stop, navigateScreen } = useScanning();

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const lastTapTime = useRef(0);


  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    didLongPress.current = false;

    // 꾹 누르기 → 스캐닝 끄기
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      stop();
    }, LONG_PRESS_DELAY);
  }, [stop]);

  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 롱프레스 타이머 해제
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (didLongPress.current) return; // 이미 롱프레스 처리됨

    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime.current;

    if (timeSinceLastTap < DOUBLE_TAP_DELAY && singleTapTimer.current) {
      // 두번터치 감지 → 화면 이동
      clearTimeout(singleTapTimer.current);
      singleTapTimer.current = null;
      lastTapTime.current = 0;
      if (navigator.vibrate) navigator.vibrate([30, 30, 30]);
      navigateScreen();
    } else {
      // 첫 번째 탭 → 지연 후 단일 터치로 처리
      lastTapTime.current = now;
      singleTapTimer.current = setTimeout(() => {
        singleTapTimer.current = null;
        if (navigator.vibrate) navigator.vibrate(30);
        selectCurrent();
      }, DOUBLE_TAP_DELAY);
    }
  }, [selectCurrent, navigateScreen]);

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

      {/* 하단 힌트 */}
      <div className={styles.overlay}>
        <div className={styles.touchHint}>
          터치 = 선택 · 꾹 = 끄기 · 두번터치 = 화면이동
        </div>
      </div>
    </>
  );
}
