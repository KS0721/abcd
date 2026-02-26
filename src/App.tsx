import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import AppShell from './components/layout/AppShell';
import ListenerModal from './components/modals/ListenerModal';
import ConfirmModal from './components/modals/ConfirmModal';
import AddCardModal from './components/modals/AddCardModal';
import EditCardModal from './components/modals/EditCardModal';
import ScanningIndicator from './components/scanning/ScanningIndicator';
import ScanningOverlay from './components/scanning/ScanningOverlay';

export default function App() {
  const loadFromStorage = useAppStore((s) => s.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <>
      <AppShell />

      {/* 전역 모달 */}
      <ListenerModal />
      <ConfirmModal />
      <AddCardModal />
      <EditCardModal />

      {/* 스캐닝 UI */}
      <ScanningIndicator />
      <ScanningOverlay />
    </>
  );
}
