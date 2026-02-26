// ========================================
// useScanningStore.ts - 스캐닝 모드 상태
// 자동 모드 전용, 3초 간격 고정
// ========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScanningConfig } from '../types';

export type ScanPhase = 'menu' | 'category' | 'card' | 'modal';

interface ScanningStore {
  // 상태
  isActive: boolean;
  phase: ScanPhase;
  currentIndex: number;
  hasLooped: boolean;
  selectedMenu: 'speak' | 'situation' | null;
  itemCount: number;

  // 설정 (persist)
  config: ScanningConfig;

  // 액션
  setActive: (active: boolean) => void;
  setPhase: (phase: ScanPhase) => void;
  setCurrentIndex: (index: number) => void;
  setHasLooped: (looped: boolean) => void;
  setSelectedMenu: (menu: 'speak' | 'situation' | null) => void;
  setItemCount: (count: number) => void;
  updateConfig: <K extends keyof ScanningConfig>(key: K, value: ScanningConfig[K]) => void;
  reset: () => void;
}

export const useScanningStore = create<ScanningStore>()(
  persist(
    (set) => ({
      isActive: false,
      phase: 'menu',
      currentIndex: 0,
      hasLooped: false,
      selectedMenu: null,
      itemCount: 0,

      config: {
        speed: 3000,
      },

      setActive: (active) => set({ isActive: active }),
      setPhase: (phase) => set({ phase, currentIndex: 0, hasLooped: false }),
      setCurrentIndex: (index) => set({ currentIndex: index }),
      setHasLooped: (looped) => set({ hasLooped: looped }),
      setSelectedMenu: (menu) => set({ selectedMenu: menu }),
      setItemCount: (count) => set({ itemCount: count }),
      updateConfig: (key, value) => set((s) => ({ config: { ...s.config, [key]: value } })),
      reset: () =>
        set({
          isActive: false,
          phase: 'menu',
          currentIndex: 0,
          hasLooped: false,
          selectedMenu: null,
          itemCount: 0,
        }),
    }),
    {
      name: 'aac_scanning_settings',
      partialize: (s) => ({ config: s.config }),
    },
  ),
);
