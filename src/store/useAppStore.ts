// ========================================
// useAppStore.ts - 메인 앱 상태 (Zustand)
// 출처: legacy/js/state.js
// ========================================

import { create } from 'zustand';
import type {
  Card, CategoryId, AppView, SlideIndex,
  ListenerModalState, ConfirmModalState, AddCardModalState,
} from '../types';
import { DEFAULT_CARDS, VERB_SUGGESTIONS } from '../data/cards';
import { isVerbForReplacement, sortCardsByGrammar, buildMessage } from '../lib/grammar';

// 로컬 스토리지 안전 접근
const safeStorage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 저장 실패 무시
    }
  },
};

const STORAGE_KEYS = {
  userCards: 'aac_user_cards',
  cardOrder: 'aac_card_order',
  history: 'aac_history',
};

function moveArrayItem<T>(arr: T[], from: number, to: number): T[] {
  const newArr = [...arr];
  const [item] = newArr.splice(from, 1);
  newArr.splice(to, 0, item);
  return newArr;
}

interface AppStore {
  // 네비게이션
  currentView: AppView;
  currentSlide: SlideIndex;
  setCurrentView: (view: AppView) => void;
  setCurrentSlide: (index: SlideIndex) => void;

  // 카테고리
  currentCategory: CategoryId;
  setCurrentCategory: (id: CategoryId) => void;

  // 카드 데이터
  cards: Record<CategoryId, Card[]>;
  userCards: Record<CategoryId, Card[]>;

  // 선택 상태
  selectedCards: Card[];
  currentMessage: string;
  selectCard: (card: Card) => void;
  deselectCard: (cardId: string) => void;
  clearSelection: () => void;

  // 편집 모드
  editMode: boolean;
  setEditMode: (enabled: boolean) => void;
  reorderCards: (category: CategoryId, from: number, to: number) => void;
  addUserCard: (category: CategoryId, card: Card) => void;
  deleteUserCard: (category: CategoryId, cardId: string) => void;

  // 기록
  history: string[];
  addToHistory: (message: string) => void;
  clearHistory: () => void;

  // 추천
  activeSuggestions: string[] | null;

  // 상황판
  activeSituation: string | null;
  setActiveSituation: (situation: string | null) => void;

  // 모달
  listenerModal: ListenerModalState;
  confirmModal: ConfirmModalState;
  addCardModal: AddCardModalState;
  openListenerModal: (message: string, isEmergency: boolean, cards: Card[]) => void;
  closeListenerModal: () => void;
  showConfirm: (message: string) => Promise<boolean>;
  closeConfirm: (result: boolean) => void;
  openAddCardModal: (category: CategoryId) => void;
  closeAddCardModal: () => void;

  // 초기화
  loadFromStorage: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // 네비게이션
  currentView: 'splash',
  currentSlide: 0,
  setCurrentView: (view) => set({ currentView: view }),
  setCurrentSlide: (index) => set({ currentSlide: index }),

  // 카테고리
  currentCategory: 'action',
  setCurrentCategory: (id) => set({ currentCategory: id }),

  // 카드 데이터 - 깊은 복사로 초기화
  cards: JSON.parse(JSON.stringify(DEFAULT_CARDS)),
  userCards: {} as Record<CategoryId, Card[]>,

  // 선택 상태
  selectedCards: [],
  currentMessage: '',

  selectCard: (card) => {
    const { selectedCards } = get();
    const isVerb = isVerbForReplacement(card);

    let newSelected: Card[];
    if (isVerb) {
      // 기존 동사 제거 후 새 동사 추가
      newSelected = selectedCards.filter((c) => !isVerbForReplacement(c));
    } else {
      newSelected = [...selectedCards];
    }
    newSelected.push(card);

    const sorted = sortCardsByGrammar(newSelected);
    const message = buildMessage(sorted);

    // 동사 추천
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

  // 편집 모드
  editMode: false,
  setEditMode: (enabled) => set({ editMode: enabled }),

  reorderCards: (category, from, to) => {
    const { cards } = get();
    if (!cards[category]) return;
    const newCards = { ...cards, [category]: moveArrayItem(cards[category], from, to) };
    set({ cards: newCards });

    // 순서 저장
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
      [category]: [...cards[category], card],
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
      [category]: cards[category].filter((c) => c.id !== cardId),
    };
    set({ cards: newCards, userCards: newUserCards });
    safeStorage.set(STORAGE_KEYS.userCards, newUserCards);
  },

  // 기록
  history: [],
  addToHistory: (message) => {
    if (!message) return;
    const { history } = get();
    const newHistory = [message, ...history.filter((m) => m !== message)].slice(0, 50);
    set({ history: newHistory });
    safeStorage.set(STORAGE_KEYS.history, newHistory);
  },
  clearHistory: () => {
    set({ history: [] });
    safeStorage.set(STORAGE_KEYS.history, []);
  },

  // 추천
  activeSuggestions: null,

  // 상황판
  activeSituation: null,
  setActiveSituation: (situation) => set({ activeSituation: situation }),

  // 모달
  listenerModal: { isOpen: false, message: '', isEmergency: false, cards: [] },
  confirmModal: { isOpen: false, message: '', resolve: null },
  addCardModal: { isOpen: false, category: null },

  openListenerModal: (message, isEmergency, cards) =>
    set({ listenerModal: { isOpen: true, message, isEmergency, cards } }),
  closeListenerModal: () =>
    set({ listenerModal: { isOpen: false, message: '', isEmergency: false, cards: [] } }),

  showConfirm: (message) => {
    return new Promise<boolean>((resolve) => {
      set({ confirmModal: { isOpen: true, message, resolve } });
    });
  },
  closeConfirm: (result) => {
    const { confirmModal } = get();
    confirmModal.resolve?.(result);
    set({ confirmModal: { isOpen: false, message: '', resolve: null } });
  },

  openAddCardModal: (category) =>
    set({ addCardModal: { isOpen: true, category } }),
  closeAddCardModal: () =>
    set({ addCardModal: { isOpen: false, category: null } }),

  // 로컬 스토리지에서 로드
  loadFromStorage: () => {
    const savedUserCards = safeStorage.get<Record<CategoryId, Card[]>>(STORAGE_KEYS.userCards);
    const savedHistory = safeStorage.get<string[]>(STORAGE_KEYS.history);
    const savedOrder = safeStorage.get<Record<string, string[]>>(STORAGE_KEYS.cardOrder);

    const cards = JSON.parse(JSON.stringify(DEFAULT_CARDS)) as Record<CategoryId, Card[]>;

    // 사용자 카드 병합
    if (savedUserCards) {
      Object.keys(savedUserCards).forEach((cat) => {
        const category = cat as CategoryId;
        if (cards[category] && savedUserCards[category]) {
          cards[category] = [...(DEFAULT_CARDS[category] || []), ...savedUserCards[category]];
        }
      });
    }

    // 카드 순서 복원
    if (savedOrder) {
      Object.keys(savedOrder).forEach((cat) => {
        const category = cat as CategoryId;
        if (cards[category] && savedOrder[cat]) {
          const orderMap = new Map(savedOrder[cat].map((id, index) => [id, index]));
          cards[category].sort((a, b) => {
            const orderA = orderMap.get(a.id) ?? 999;
            const orderB = orderMap.get(b.id) ?? 999;
            return orderA - orderB;
          });
        }
      });
    }

    set({
      cards,
      userCards: savedUserCards || ({} as Record<CategoryId, Card[]>),
      history: savedHistory || [],
    });
  },
}));
