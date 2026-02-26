// ========================================
// useAppStore.ts - 메인 앱 상태 (Zustand)
// ========================================

import { create } from 'zustand';
import type {
  Card, CategoryId, AppView, SlideIndex,
  ListenerModalState, ConfirmModalState, AddCardModalState, EditCardModalState,
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
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // 무시
    }
  },
};

const STORAGE_KEYS = {
  userCards: 'aac_user_cards',
  cardOrder: 'aac_card_order',
  quickPhrases: 'aac_quick_phrases',
  history: 'aac_history',
};

// 빠른 문장 기본값: 핵심 의사소통 + 한국 사회적 표현
// 연구 근거: 김영태 외(2003) 핵심어휘, 한국 문화 필수 인사/식사 표현
const DEFAULT_QUICK_PHRASES = [
  '안녕하세요',
  '감사합니다',
  '화장실 가고 싶어요',
  '배고파요',
  '아파요',
  '도와주세요',
  '괜찮아요',
  '잠깐만요',
  '물 주세요',
  '집에 가고 싶어요',
  // 한국 사회적 표현 (Tier 2: 문화 특화 필수)
  '잘 먹겠습니다',
  '잘 먹었습니다',
  '수고하세요',
  '안녕히 가세요',
  '실례합니다',
  '죄송합니다',
  // 의사소통 수리 전략 (Brekke & von Tetzchner, 2003)
  // 상대가 못 알아들었을 때 대화 포기 방지
  '다시 말할게요',
  '그게 아니에요',
  '천천히 말해주세요',
  '네 아니요로 물어봐 주세요',
];

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
  updateUserCard: (category: CategoryId, cardId: string, updates: Partial<Card>) => void;

  // 빠른 문장
  quickPhrases: string[];
  addQuickPhrase: (phrase: string) => void;
  removeQuickPhrase: (index: number) => void;
  updateQuickPhrase: (index: number, newPhrase: string) => void;

  // 기록
  // 연구 근거: Higginbotham & Wilkins (1999) - 의사소통 이력으로 반복 발화 50%↑
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
  editCardModal: EditCardModalState;
  openListenerModal: (message: string, isEmergency: boolean, cards: Card[]) => void;
  closeListenerModal: () => void;
  showConfirm: (message: string) => Promise<boolean>;
  closeConfirm: (result: boolean) => void;
  openAddCardModal: (category: CategoryId) => void;
  closeAddCardModal: () => void;
  openEditCardModal: (card: Card, category: CategoryId) => void;
  closeEditCardModal: () => void;

  // 초기화
  loadFromStorage: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // 네비게이션
  currentView: 'app',
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

  // 편집 모드
  editMode: false,
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
  // 🤖 AI TODO: LLM으로 기록 분석 → 자주 쓰는 패턴 학습 → 빠른 문장 자동 추천
  history: [],

  addToHistory: (message) => {
    const { history } = get();
    // 중복 방지: 직전 문장과 같으면 추가하지 않음
    if (history.length > 0 && history[0] === message) return;
    const updated = [message, ...history].slice(0, 100); // 최대 100개
    set({ history: updated });
    safeStorage.set(STORAGE_KEYS.history, updated);
  },

  clearHistory: () => {
    set({ history: [] });
    safeStorage.remove(STORAGE_KEYS.history);
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
  editCardModal: { isOpen: false, card: null, category: null },

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

  openEditCardModal: (card, category) =>
    set({ editCardModal: { isOpen: true, card, category } }),
  closeEditCardModal: () =>
    set({ editCardModal: { isOpen: false, card: null, category: null } }),

  // 로컬 스토리지에서 로드
  loadFromStorage: () => {
    const savedUserCards = safeStorage.get<Record<CategoryId, Card[]>>(STORAGE_KEYS.userCards);
    const savedOrder = safeStorage.get<Record<string, string[]>>(STORAGE_KEYS.cardOrder);
    const savedPhrases = safeStorage.get<string[]>(STORAGE_KEYS.quickPhrases);
    const savedHistory = safeStorage.get<string[]>(STORAGE_KEYS.history);

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

    // 이전 버전 localStorage 정리
    safeStorage.remove('aac_user_pin');
    safeStorage.remove('aac_guardian_profiles');

    set({
      cards,
      userCards: savedUserCards || ({} as Record<CategoryId, Card[]>),
      quickPhrases: savedPhrases || DEFAULT_QUICK_PHRASES,
      history: savedHistory || [],
    });
  },
}));
