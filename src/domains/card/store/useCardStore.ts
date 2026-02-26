// ========================================
// useCardStore.ts - 카드 도메인 상태
// ========================================

import { create } from 'zustand';
import type { Card, CategoryId } from '../models.ts';
import { DEFAULT_CARDS } from '../data/index.ts';
import { moveArrayItem, mergeUserCards } from '../services/cardService.ts';
import { safeStorage } from '@/infrastructure/storage/safeStorage.ts';
import { STORAGE_KEYS } from '@/shared/constants.ts';

interface CardStore {
  // 카드 데이터
  cards: Record<CategoryId, Card[]>;
  userCards: Record<CategoryId, Card[]>;
  currentCategory: CategoryId;
  editMode: boolean;

  // 액션
  setCurrentCategory: (id: CategoryId) => void;
  setEditMode: (enabled: boolean) => void;
  reorderCards: (category: CategoryId, from: number, to: number) => void;
  addUserCard: (category: CategoryId, card: Card) => void;
  deleteUserCard: (category: CategoryId, cardId: string) => void;
  updateUserCard: (category: CategoryId, cardId: string, updates: Partial<Card>) => void;
  loadFromStorage: () => void;
}

export const useCardStore = create<CardStore>((set, get) => ({
  // 카드 데이터 - 깊은 복사로 초기화
  cards: JSON.parse(JSON.stringify(DEFAULT_CARDS)),
  userCards: {} as Record<CategoryId, Card[]>,
  currentCategory: 'action',
  editMode: false,

  setCurrentCategory: (id) => set({ currentCategory: id }),
  setEditMode: (enabled) => set({ editMode: enabled }),

  reorderCards: (category, from, to) => {
    const { cards } = get();
    if (!cards[category]) return;
    const newCards = { ...cards, [category]: moveArrayItem(cards[category], from, to) };
    set({ cards: newCards });

    const order: Record<string, string[]> = {};
    Object.keys(newCards).forEach((cat) => {
      order[cat] = newCards[cat as CategoryId].map((c) => c.id);
    });
    safeStorage.set(STORAGE_KEYS.cardOrder, order);
  },

  addUserCard: (category, card) => {
    const { cards, userCards } = get();
    const newUserCards = {
      ...userCards,
      [category]: [...(userCards[category] || []), card],
    };
    const newCards = {
      ...cards,
      [category]: [...(cards[category] || []), card],
    };
    set({ cards: newCards, userCards: newUserCards });
    safeStorage.set(STORAGE_KEYS.userCards, newUserCards);
  },

  deleteUserCard: (category, cardId) => {
    const { cards, userCards } = get();
    const newUserCards = {
      ...userCards,
      [category]: (userCards[category] || []).filter((c) => c.id !== cardId),
    };
    const newCards = {
      ...cards,
      [category]: (cards[category] || []).filter((c) => c.id !== cardId),
    };
    set({ cards: newCards, userCards: newUserCards });
    safeStorage.set(STORAGE_KEYS.userCards, newUserCards);
  },

  updateUserCard: (category, cardId, updates) => {
    const { cards, userCards } = get();
    const updateCard = (c: Card) => c.id === cardId ? { ...c, ...updates } : c;
    const newUserCards = {
      ...userCards,
      [category]: (userCards[category] || []).map(updateCard),
    };
    const newCards = {
      ...cards,
      [category]: (cards[category] || []).map(updateCard),
    };
    set({ cards: newCards, userCards: newUserCards });
    safeStorage.set(STORAGE_KEYS.userCards, newUserCards);
  },

  loadFromStorage: () => {
    const savedUserCards = safeStorage.get<Record<CategoryId, Card[]>>(STORAGE_KEYS.userCards);
    const savedOrder = safeStorage.get<Record<string, string[]>>(STORAGE_KEYS.cardOrder);

    const { cards, userCards } = mergeUserCards(DEFAULT_CARDS, savedUserCards, savedOrder);

    // 이전 버전 localStorage 정리
    safeStorage.remove('aac_user_pin');
    safeStorage.remove('aac_guardian_profiles');

    set({ cards, userCards });
  },
}));
