// ========================================
// useUserDataStore.ts - 사용자 데이터 도메인 상태
// ========================================

import { create } from 'zustand';
import { safeStorage } from '@/infrastructure/storage/safeStorage.ts';
import { STORAGE_KEYS, DEFAULT_QUICK_PHRASES } from '@/shared/constants.ts';
import { recordPhraseUsage } from '../services/usageStatsService.ts';

interface UserDataStore {
  // 빠른 문장
  quickPhrases: string[];
  addQuickPhrase: (phrase: string) => void;
  removeQuickPhrase: (index: number) => void;
  updateQuickPhrase: (index: number, newPhrase: string) => void;

  // 기록
  history: string[];
  addToHistory: (message: string) => void;
  clearHistory: () => void;

  // 초기화
  loadFromStorage: () => void;
}

export const useUserDataStore = create<UserDataStore>((set, get) => ({
  // 빠른 문장
  quickPhrases: DEFAULT_QUICK_PHRASES,

  addQuickPhrase: (phrase) => {
    const { quickPhrases } = get();
    if (quickPhrases.includes(phrase)) return;
    const updated = [...quickPhrases, phrase];
    set({ quickPhrases: updated });
    safeStorage.set(STORAGE_KEYS.quickPhrases, updated);
  },

  removeQuickPhrase: (index) => {
    const updated = get().quickPhrases.filter((_, i) => i !== index);
    set({ quickPhrases: updated });
    safeStorage.set(STORAGE_KEYS.quickPhrases, updated);
  },

  updateQuickPhrase: (index, newPhrase) => {
    const updated = get().quickPhrases.map((p, i) => i === index ? newPhrase : p);
    set({ quickPhrases: updated });
    safeStorage.set(STORAGE_KEYS.quickPhrases, updated);
  },

  // 기록
  history: [],

  addToHistory: (message) => {
    const { history } = get();
    // 중복 방지: 직전 문장과 같으면 추가하지 않음
    if (history.length > 0 && history[0] === message) return;
    const updated = [message, ...history].slice(0, 100); // 최대 100개
    set({ history: updated });
    safeStorage.set(STORAGE_KEYS.history, updated);

    // 완성 문장 발화 빈도 기록 (백그라운드)
    recordPhraseUsage(message);
  },

  clearHistory: () => {
    set({ history: [] });
    safeStorage.remove(STORAGE_KEYS.history);
  },

  loadFromStorage: () => {
    const savedPhrases = safeStorage.get<string[]>(STORAGE_KEYS.quickPhrases);
    const savedHistory = safeStorage.get<string[]>(STORAGE_KEYS.history);

    set({
      quickPhrases: savedPhrases || DEFAULT_QUICK_PHRASES,
      history: savedHistory || [],
    });
  },
}));
