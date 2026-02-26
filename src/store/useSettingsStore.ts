// ========================================
// useSettingsStore.ts - 설정 상태 (Zustand + persist)
// ========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '../types';

interface SettingsStore extends Settings {
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      highContrast: true,
      darkMode: false,
      fontSize: 'medium',
      vibration: true,
      gridSize: '4x4' as const,
      dwellTime: 0,

      updateSetting: (key, value) => {
        set({ [key]: value });

        // DOM에 data 속성 적용
        if (key === 'darkMode') {
          if (value) {
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.removeAttribute('data-theme');
          }
        }
        if (key === 'highContrast') {
          if (value) {
            document.documentElement.setAttribute('data-contrast', 'high');
          } else {
            document.documentElement.removeAttribute('data-contrast');
          }
        }
        if (key === 'fontSize') {
          document.documentElement.setAttribute('data-font-size', value as string);
        }
        if (key === 'gridSize') {
          // gridSize '4x4' → 4 columns
          const cols = parseInt((value as string).split('x')[0], 10);
          document.documentElement.style.setProperty('--card-columns', String(cols));
        }
      },
    }),
    {
      name: 'aac_settings',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // 고대비 모드: 사용자 설정값 존중 (기본값 true, 설정에서 끌 수 있음)
        if (state.highContrast) {
          document.documentElement.setAttribute('data-contrast', 'high');
        } else {
          document.documentElement.removeAttribute('data-contrast');
        }
        // 복원된 설정을 DOM에 적용
        if (state.darkMode) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
        document.documentElement.setAttribute('data-font-size', state.fontSize);
        // gridSize를 CSS 변수에 적용
        const cols = parseInt(state.gridSize.split('x')[0], 10);
        document.documentElement.style.setProperty('--card-columns', String(cols));
      },
    },
  ),
);
