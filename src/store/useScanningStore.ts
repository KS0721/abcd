// ========================================
// useScanningStore.ts - 스캐닝 모드 상태
// 출처: legacy/js/modules/scanning.js
//
// 운동 장애 사용자를 위한 2단계 행-열 스캐닝
// 권순복 & 김수진(2019) 연구 기반
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
        speed: 2000,
        method: 'auto',
        highlightColor: '#FF6B00',
      },

      setActive: (active) => set({ isActive: active }),
      setPhase: (phase) => set({ phase, currentIndex: 0, hasLooped: false }),
      setCurrentIndex: (index) => set({ currentIndex: index }),
      setHasLooped: (looped) => set({ hasLooped: looped }),
      setSelectedMenu: (menu) => set({ selectedMenu: menu }),
      setItemCount: (count) => set({ itemCount: count }),
      updateConfig: (key, value) =>
        set((s) => ({ config: { ...s.config, [key]: value } })),
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
