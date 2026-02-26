// ========================================
// useSpeechStore.ts - 음성 설정 (Zustand + persist)
// 프리셋 기반: 자동 / 작게 / 보통 / 크게
// ========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SpeechSettings, SpeechPreset } from '../types';

interface SpeechStore extends SpeechSettings {
  updateSpeechSetting: <K extends keyof SpeechSettings>(key: K, value: SpeechSettings[K]) => void;
}

export const useSpeechStore = create<SpeechStore>()(
  persist(
    (set) => ({
      rate: 'auto' as SpeechPreset,
      pitch: 'auto' as SpeechPreset,
      volume: 'auto' as SpeechPreset,
      voiceName: '',
      cardSpeak: true,
      repeatOnShow: true,

      updateSpeechSetting: (key, value) => set({ [key]: value }),
    }),
    {
      name: 'aac_speech_settings',
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // 마이그레이션: 이전 숫자 값 → 프리셋으로 변환
        if (typeof state.rate === 'number') state.rate = 'auto';
        if (typeof state.pitch === 'number') state.pitch = 'auto';
        if (typeof state.volume === 'number') state.volume = 'auto';
      },
    },
  ),
);

// 프리셋 → 실제 값 매핑
export const RATE_VALUES: Record<SpeechPreset, number> = {
  auto: 1.0, small: 0.7, medium: 1.0, large: 1.5,
};
export const PITCH_VALUES: Record<SpeechPreset, number> = {
  auto: 1.0, small: 0.7, medium: 1.0, large: 1.5,
};
export const VOLUME_VALUES: Record<SpeechPreset, number> = {
  auto: -1, small: 0.3, medium: 0.6, large: 1.0, // -1 = adaptive
};
