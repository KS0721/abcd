import { useAppStore } from '../../store/useAppStore';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';
import Header from './Header';
import OutputBar from './OutputBar';
import TabBar from './TabBar';
import SpeakScreen from '../screens/SpeakScreen';
import SituationScreen from '../screens/SituationScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import styles from '../../styles/AppShell.module.css';

export default function AppShell() {
  const currentSlide = useAppStore((s) => s.currentSlide);
  const { handleTouchStart, handleTouchEnd } = useSwipeGesture();

  return (
    <div className={styles.app}>
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
            <div className={styles.slide}><SpeakScreen /></div>
            <div className={styles.slide}><SituationScreen /></div>
            <div className={styles.slide}><HistoryScreen /></div>
            <div className={styles.slide}><SettingsScreen /></div>
          </div>
        </div>
      </div>

      <OutputBar />
      <TabBar />
    </div>
  );
}
