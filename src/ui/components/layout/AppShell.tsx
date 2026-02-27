import { lazy, Suspense, useMemo } from 'react';
import { useUIStore } from '../../store/useUIStore.ts';
import { useSwipeGesture } from '../../hooks/useSwipeGesture.ts';
import Header from './Header';
import OutputBar from './OutputBar';
import TabBar from './TabBar';
import Loading from './Loading';
import ScreenErrorBoundary from './ScreenErrorBoundary';
import SpeakScreen from '../screens/SpeakScreen';
import styles from '../../styles/AppShell.module.css';

const STTScreen = lazy(() => import('../screens/STTScreen'));

// 비활성 화면 lazy loading (SpeakScreen은 기본 화면이므로 정적 import 유지)
const SituationScreen = lazy(() => import('../screens/SituationScreen'));
const HistoryScreen = lazy(() => import('../screens/HistoryScreen'));
const QuickPhrasesScreen = lazy(() => import('../screens/QuickPhrasesScreen'));
const SettingsScreen = lazy(() => import('../screens/SettingsScreen'));

const SCREEN_NAMES = ['말하기', '상황', '기록', '빠른 문장', '설정'] as const;

export default function AppShell() {
  const currentSlide = useUIStore((s) => s.currentSlide);
  const sttPanelOpen = useUIStore((s) => s.sttPanelOpen);
  const { handleTouchStart, handleTouchEnd } = useSwipeGesture();

  const screenAnnouncement = useMemo(
    () => `${SCREEN_NAMES[currentSlide]} 화면`,
    [currentSlide],
  );

  return (
    <div className={styles.app}>
      {/* 스크린리더 화면 전환 알림 */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      >
        {screenAnnouncement}
      </div>

      <Header />

      <div
        className={styles.mainContent}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.slideContainer}>
          <div
            className={styles.slideWrapper}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <div className={styles.slide}><ScreenErrorBoundary screenName="말하기"><SpeakScreen /></ScreenErrorBoundary></div>
            <div className={styles.slide}><ScreenErrorBoundary screenName="상황"><Suspense fallback={<Loading />}><SituationScreen /></Suspense></ScreenErrorBoundary></div>
            <div className={styles.slide}><ScreenErrorBoundary screenName="기록"><Suspense fallback={<Loading />}><HistoryScreen /></Suspense></ScreenErrorBoundary></div>
            <div className={styles.slide}><ScreenErrorBoundary screenName="빠른 문장"><Suspense fallback={<Loading />}><QuickPhrasesScreen /></Suspense></ScreenErrorBoundary></div>
            <div className={styles.slide}><ScreenErrorBoundary screenName="설정"><Suspense fallback={<Loading />}><SettingsScreen /></Suspense></ScreenErrorBoundary></div>
          </div>
        </div>
      </div>

      {/* STT 패널 — 위에서 내려오는 오버레이 */}
      {sttPanelOpen && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 900,
          background: 'var(--color-bg)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'sttSlideDown 0.25s ease',
        }}>
          <Suspense fallback={<Loading />}><STTScreen /></Suspense>
          <style>{`
            @keyframes sttSlideDown {
              from { transform: translateY(-100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      <OutputBar />
      <TabBar />
    </div>
  );
}
