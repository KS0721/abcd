import { lazy, Suspense, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { useCardStore } from './domains/card/store/useCardStore.ts';
import { useUserDataStore } from './domains/user-data/store/useUserDataStore.ts';
import AppShell from './ui/components/layout/AppShell';
import ListenerModal from './ui/components/modals/ListenerModal';
import ConfirmModal from './ui/components/modals/ConfirmModal';
import ScanningIndicator from './ui/components/scanning/ScanningIndicator';
import ScanningOverlay from './ui/components/scanning/ScanningOverlay';

// 카드 추가/수정 모달은 사용 빈도가 낮으므로 lazy loading
const AddCardModal = lazy(() => import('./ui/components/modals/AddCardModal'));
const EditCardModal = lazy(() => import('./ui/components/modals/EditCardModal'));

export default function App() {
  const loadCards = useCardStore((s) => s.loadFromStorage);
  const loadUserData = useUserDataStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadCards();
    loadUserData();

    // 네이티브 앱: 스플래시 스크린 숨기기
    if (Capacitor.isNativePlatform()) {
      SplashScreen.hide();
    }
  }, [loadCards, loadUserData]);

  return (
    <>
      <AppShell />

      {/* 전역 모달 */}
      <ListenerModal />
      <ConfirmModal />
      <Suspense fallback={null}>
        <AddCardModal />
        <EditCardModal />
      </Suspense>

      {/* 스캐닝 UI */}
      <ScanningIndicator />
      <ScanningOverlay />
    </>
  );
}
