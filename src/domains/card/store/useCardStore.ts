// ========================================
// useCardStore.ts - 카드 도메인 상태
// ========================================

import { create } from 'zustand';
import type { Card } from '../models.ts';
import { DEFAULT_CARDS } from '../data/index.ts';
import { moveArrayItem, mergeUserCards } from '../services/cardService.ts';
import { safeStorage } from '@/infrastructure/storage/safeStorage.ts';
import { STORAGE_KEYS } from '@/shared/constants.ts';

export interface UserCategory {
  id: string;
  name: string;
}

interface CardStore {
  // 카드 데이터
  cards: Record<string, Card[]>;
  userCards: Record<string, Card[]>;
  currentCategory: string;
  editMode: boolean;

  // 사용자 카테고리
  userCategories: UserCategory[];

  // 액션
  setCurrentCategory: (id: string) => void;
  setEditMode: (enabled: boolean) => void;
  reorderCards: (category: string, from: number, to: number) => void;
  addUserCard: (category: string, card: Card) => void;
  deleteUserCard: (category: string, cardId: string) => void;
  updateUserCard: (category: string, cardId: string, updates: Partial<Card>) => void;
  addUserCategory: (name: string) => void;
  removeUserCategory: (id: string) => void;
  loadFromStorage: () => void;
}

export const useCardStore = create<CardStore>((set, get) => ({
  // 카드 데이터 - 깊은 복사로 초기화
  cards: JSON.parse(JSON.stringify(DEFAULT_CARDS)),
  userCards: {} as Record<string, Card[]>,
  currentCategory: 'action',
  editMode: false,
  userCategories: [],

  setCurrentCategory: (id) => set({ currentCategory: id }),
  setEditMode: (enabled) => set({ editMode: enabled }),

  reorderCards: (category, from, to) => {
    const { cards } = get();
    if (!cards[category]) return;
    const newCards = { ...cards, [category]: moveArrayItem(cards[category], from, to) };
    set({ cards: newCards });

    const order: Record<string, string[]> = {};
    Object.keys(newCards).forEach((cat) => {
      order[cat] = newCards[cat].map((c) => c.id);
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

  addUserCategory: (name) => {
    const { userCategories } = get();
    const id = `user_${Date.now()}`;
    const newCategories = [...userCategories, { id, name }];
    set({ userCategories: newCategories });
    safeStorage.set(STORAGE_KEYS.userCategories, newCategories);
  },

  removeUserCategory: (id) => {
    const { userCategories, cards, userCards, currentCategory } = get();
    const newCategories = userCategories.filter((c) => c.id !== id);
    // 해당 카테고리의 카드도 삭제
    const newCards = { ...cards };
    const newUserCards = { ...userCards };
    delete newCards[id];
    delete newUserCards[id];
    set({
      userCategories: newCategories,
      cards: newCards,
      userCards: newUserCards,
      // 삭제된 카테고리가 선택 중이면 기본 카테고리로
      currentCategory: currentCategory === id ? 'action' : currentCategory,
    });
    safeStorage.set(STORAGE_KEYS.userCategories, newCategories);
    safeStorage.set(STORAGE_KEYS.userCards, newUserCards);
  },

  loadFromStorage: () => {
    const savedUserCards = safeStorage.get<Record<string, Card[]>>(STORAGE_KEYS.userCards);
    const savedOrder = safeStorage.get<Record<string, string[]>>(STORAGE_KEYS.cardOrder);
    const savedUserCategories = safeStorage.get<UserCategory[]>(STORAGE_KEYS.userCategories);

    const { cards, userCards } = mergeUserCards(DEFAULT_CARDS, savedUserCards, savedOrder);

    // 사용자 카테고리의 카드 병합
    const mergedCards: Record<string, Card[]> = { ...cards };
    const mergedUserCards: Record<string, Card[]> = { ...userCards };
    if (savedUserCards && savedUserCategories) {
      for (const cat of savedUserCategories) {
        if (savedUserCards[cat.id]) {
          mergedCards[cat.id] = savedUserCards[cat.id];
          mergedUserCards[cat.id] = savedUserCards[cat.id];
        }
      }
    }

    // 이전 버전 localStorage 정리
    safeStorage.remove('aac_user_pin');
    safeStorage.remove('aac_guardian_profiles');

    set({
      cards: mergedCards,
      userCards: mergedUserCards,
      userCategories: savedUserCategories || [],
    });
  },
}));
