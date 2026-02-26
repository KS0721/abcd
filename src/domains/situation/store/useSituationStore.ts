// ========================================
// useSituationStore.ts - 상황판 도메인 상태
// ========================================

import { create } from 'zustand';

interface SituationStore {
  activeSituation: string | null;
  setActiveSituation: (situation: string | null) => void;
}

export const useSituationStore = create<SituationStore>((set) => ({
  activeSituation: null,
  setActiveSituation: (situation) => set({ activeSituation: situation }),
}));
