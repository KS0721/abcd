import { useEffect, useCallback } from 'react';
import { useAppStore } from './store/useAppStore';
import SplashScreen from './components/screens/SplashScreen';
import MainMenu from './components/screens/MainMenu';
import AppShell from './components/layout/AppShell';
import ListenerModal from './components/modals/ListenerModal';
import ConfirmModal from './components/modals/ConfirmModal';
import AddCardModal from './components/modals/AddCardModal';
import ScanningIndicator from './components/scanning/ScanningIndicator';
import ScanningOverlay from './components/scanning/ScanningOverlay';

export default function App() {
  const currentView = useAppStore((s) => s.currentView);
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const loadFromStorage = useAppStore((s) => s.loadFromStorage);

  // 앱 초기화
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const handleSplashComplete = useCallback(() => {
    setCurrentView('menu');
  }, [setCurrentView]);

  return (
    <>
      {currentView === 'splash' && <SplashScreen onComplete={handleSplashComplete} />}
      {currentView === 'menu' && <MainMenu />}
      {currentView === 'app' && <AppShell />}

      {/* 전역 모달 */}
      <ListenerModal />
      <ConfirmModal />
      <AddCardModal />

      {/* 스캐닝 UI */}
      <ScanningIndicator />
      <ScanningOverlay />
    </>
  );
}
