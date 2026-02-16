// ========================================
// useSpeechStore.ts - 음성 설정 (Zustand + persist)
// ========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SpeechSettings } from '../types';

interface SpeechStore extends SpeechSettings {
  updateSpeechSetting: <K extends keyof SpeechSettings>(key: K, value: SpeechSettings[K]) => void;
}

export const useSpeechStore = create<SpeechStore>()(
  persist(
    (set) => ({
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      voiceName: '',
      cardSpeak: true,
      repeatOnShow: true,

      updateSpeechSetting: (key, value) => set({ [key]: value }),
    }),
    { name: 'aac_speech_settings' },
  ),
);
