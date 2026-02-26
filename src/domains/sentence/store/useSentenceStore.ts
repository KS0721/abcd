// ========================================
// useSentenceStore.ts - 문장 생성 도메인 상태
// ========================================

import { create } from 'zustand';
import type { Card } from '../../card/models.ts';
import { isVerbForReplacement, sortCardsByGrammar, buildMessage } from '../services/grammarService.ts';
import { VERB_SUGGESTIONS } from '../../card/data/index.ts';
import { recordCardUsage } from '../../user-data/services/usageStatsService.ts';

interface SentenceStore {
  selectedCards: Card[];
  currentMessage: string;
  activeSuggestions: string[] | null;

  selectCard: (card: Card) => void;
  deselectCard: (cardId: string) => void;
  clearSelection: () => void;
}

export const useSentenceStore = create<SentenceStore>((set, get) => ({
  selectedCards: [],
  currentMessage: '',
  activeSuggestions: null,

  selectCard: (card) => {
    const { selectedCards } = get();
    const isVerb = isVerbForReplacement(card);

    // 사용 통계 기록 (백그라운드)
    const previousCard = selectedCards.length > 0
      ? selectedCards[selectedCards.length - 1]
      : undefined;
    recordCardUsage(card.id, previousCard?.id);

    let newSelected: Card[];
    if (isVerb) {
      newSelected = selectedCards.filter((c) => !isVerbForReplacement(c));
    } else {
      newSelected = [...selectedCards];
    }
    newSelected.push(card);

    const sorted = sortCardsByGrammar(newSelected);
    const message = buildMessage(sorted);
    const suggestions = isVerb ? (VERB_SUGGESTIONS[card.id] || null) : get().activeSuggestions;

    set({
      selectedCards: sorted,
      currentMessage: message,
      activeSuggestions: suggestions,
    });
  },

  deselectCard: (cardId) => {
    const newSelected = get().selectedCards.filter((c) => c.id !== cardId);
    set({
      selectedCards: newSelected,
      currentMessage: buildMessage(newSelected),
    });
  },

  clearSelection: () => set({
    selectedCards: [],
    currentMessage: '',
    activeSuggestions: null,
  }),
}));
