// ========================================
// useUIStore.ts - UI 상태 (뷰, 모달)
// ========================================

import { create } from 'zustand';
import type { Card, CategoryId } from '@/domains/card/models.ts';
import type {
  AppView, SlideIndex,
  ListenerModalState, ConfirmModalState, AddCardModalState, EditCardModalState,
} from '@/shared/types.ts';

interface UIStore {
  // 네비게이션
  currentView: AppView;
  currentSlide: SlideIndex;
  setCurrentView: (view: AppView) => void;
  setCurrentSlide: (index: SlideIndex) => void;

  // 모달
  listenerModal: ListenerModalState;
  confirmModal: ConfirmModalState;
  addCardModal: AddCardModalState;
  editCardModal: EditCardModalState;
  openListenerModal: (message: string, isEmergency: boolean, cards: Card[], withSpeech?: boolean) => void;
  closeListenerModal: () => void;
  showConfirm: (message: string) => Promise<boolean>;
  closeConfirm: (result: boolean) => void;
  openAddCardModal: (category: CategoryId) => void;
  closeAddCardModal: () => void;
  openEditCardModal: (card: Card, category: CategoryId) => void;
  closeEditCardModal: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // 네비게이션
  currentView: 'app',
  currentSlide: 0,
  setCurrentView: (view) => set({ currentView: view }),
  setCurrentSlide: (index) => set({ currentSlide: index }),

  // 모달
  listenerModal: { isOpen: false, message: '', isEmergency: false, cards: [], withSpeech: false },
  confirmModal: { isOpen: false, message: '', resolve: null },
  addCardModal: { isOpen: false, category: null },
  editCardModal: { isOpen: false, card: null, category: null },

  openListenerModal: (message, isEmergency, cards, withSpeech = true) =>
    set({ listenerModal: { isOpen: true, message, isEmergency, cards, withSpeech } }),
  closeListenerModal: () =>
    set({ listenerModal: { isOpen: false, message: '', isEmergency: false, cards: [], withSpeech: false } }),

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
}));
