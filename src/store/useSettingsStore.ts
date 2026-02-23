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
      },
    }),
    {
      name: 'aac_settings',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // 고대비 모드 항상 활성화 (기본값 강제)
        state.highContrast = true;
        document.documentElement.setAttribute('data-contrast', 'high');
        // 복원된 설정을 DOM에 적용
        if (state.darkMode) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
        document.documentElement.setAttribute('data-font-size', state.fontSize);
      },
    },
  ),
);
