/* ========================================
   state.js - 상태 관리
======================================== */

import { DEFAULT_CATEGORIES, DEFAULT_CARDS } from './data/cards.js';
import { safeStorage, moveArrayItem } from './utils/helpers.js';

// 스토리지 키
const STORAGE_KEYS = {
    categories: 'aac_categories',
    userCards: 'aac_user_cards',
    cardOrder: 'aac_card_order',
    history: 'aac_history',
    settings: 'aac_settings'
};

// 앱 상태
const State = {
    // 현재 슬라이드 (0: 말하기, 1: 기록, 2: 검색, 3: 설정)
    currentSlide: 0,
    
    // 현재 카테고리
    currentCategory: 'action',
    
    // 편집 모드
    editMode: false,
    
    // 선택된 카드들
    selectedCards: [],
    
    // 현재 메시지
    currentMessage: '',
    
    // 카테고리 목록
    categories: [...DEFAULT_CATEGORIES],
    
    // 카드 데이터 (카테고리별)
    cards: JSON.parse(JSON.stringify(DEFAULT_CARDS)),
    
    // 사용자 추가 카드
    userCards: {},
    
    // 사용 기록
    history: [],
    
    // 설정
    settings: {
        highContrast: false,
        darkMode: false,
        fontSize: 'medium',
        vibration: true
    }
};

// 상태 변경 리스너
const listeners = [];

// 리스너 등록
export function subscribe(listener) {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
    };
}

// 상태 변경 알림
function notifyListeners() {
    listeners.forEach(listener => listener(State));
}

// 상태 가져오기
export function getState() {
    return State;
}

// ========================================
// 로컬 스토리지 관리
// ========================================

// 저장된 데이터 로드
export function loadFromStorage() {
    // 카테고리 로드
    const savedCategories = safeStorage.get(STORAGE_KEYS.categories);
    if (savedCategories) {
        State.categories = savedCategories;
    }
    
    // 사용자 카드 로드
    const savedUserCards = safeStorage.get(STORAGE_KEYS.userCards);
    if (savedUserCards) {
        State.userCards = savedUserCards;
        
        // 기본 카드와 사용자 카드 병합
        Object.keys(savedUserCards).forEach(category => {
            if (State.cards[category]) {
                State.cards[category] = [
                    ...DEFAULT_CARDS[category] || [],
                    ...savedUserCards[category] || []
                ];
            }
        });
    }
    
    // 카드 순서 로드
    const savedOrder = safeStorage.get(STORAGE_KEYS.cardOrder);
    if (savedOrder) {
        Object.keys(savedOrder).forEach(category => {
            if (State.cards[category]) {
                const orderMap = new Map(savedOrder[category].map((id, index) => [id, index]));
                State.cards[category].sort((a, b) => {
                    const orderA = orderMap.has(a.id) ? orderMap.get(a.id) : 999;
                    const orderB = orderMap.has(b.id) ? orderMap.get(b.id) : 999;
                    return orderA - orderB;
                });
            }
        });
    }
    
    // 기록 로드
    const savedHistory = safeStorage.get(STORAGE_KEYS.history);
    if (savedHistory) {
        State.history = savedHistory;
    }
    
    // 설정 로드
    const savedSettings = safeStorage.get(STORAGE_KEYS.settings);
    if (savedSettings) {
        State.settings = { ...State.settings, ...savedSettings };
    }
    
    // 설정 적용
    applySettings();
    
    console.log('📦 데이터 로드 완료');
}

// 카테고리 저장
export function saveCategories() {
    safeStorage.set(STORAGE_KEYS.categories, State.categories);
}

// 사용자 카드 저장
export function saveUserCards() {
    safeStorage.set(STORAGE_KEYS.userCards, State.userCards);
}

// 카드 순서 저장
export function saveCardOrder() {
    const order = {};
    Object.keys(State.cards).forEach(category => {
        order[category] = State.cards[category].map(card => card.id);
    });
    safeStorage.set(STORAGE_KEYS.cardOrder, order);
}

// 기록 저장
export function saveHistory() {
    safeStorage.set(STORAGE_KEYS.history, State.history);
}

// 설정 저장
export function saveSettings() {
    safeStorage.set(STORAGE_KEYS.settings, State.settings);
}

// 설정 적용
function applySettings() {
    const app = document.getElementById('app');
    if (!app) return;
    
    // 다크 모드
    if (State.settings.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // 고대비 모드
    if (State.settings.highContrast) {
        document.documentElement.setAttribute('data-contrast', 'high');
    } else {
        document.documentElement.removeAttribute('data-contrast');
    }
    
    // 글자 크기
    document.documentElement.setAttribute('data-font-size', State.settings.fontSize);
}

// ========================================
// 상태 수정 함수들
// ========================================

// 슬라이드 변경
export function setCurrentSlide(index) {
    State.currentSlide = index;
    notifyListeners();
}

// 카테고리 변경
export function setCurrentCategory(categoryId) {
    State.currentCategory = categoryId;
    notifyListeners();
}

// 편집 모드 토글
export function setEditMode(enabled) {
    State.editMode = enabled;
    notifyListeners();
}

// 카드 선택 (동사는 하나만, 문법 순서 자동 정렬)
export function selectCard(card) {
    // 동사/서술어인지 확인 (grammarType 우선, ID 기반 폴백)
    const isVerb = card.grammarType === 'verb' ||
                   card.id.startsWith('c_do') || card.id.startsWith('c_go') ||
                   card.id.startsWith('c_come') || card.id.startsWith('c_see') ||
                   card.id.startsWith('c_give') || card.id.startsWith('c_eat') ||
                   card.id.startsWith('c_drink') || card.id.startsWith('c_exist') ||
                   card.id.startsWith('c_notexist') || card.id.startsWith('c_want') ||
                   card.id.startsWith('act_') || 
                   card.id.startsWith('fo_') ||  // fo_moreeat 등 동사
                   (card.id.startsWith('f') && !card.id.startsWith('fo')) ||  // f1~f18 감정(동사), fo 제외
                   card.id.startsWith('em');
    
    // 동사가 이미 선택되어 있으면 제거하고 새로운 동사로 교체
    if (isVerb) {
        State.selectedCards = State.selectedCards.filter(c => {
            const cIsVerb = c.grammarType === 'verb' ||
                           c.id.startsWith('c_do') || c.id.startsWith('c_go') ||
                           c.id.startsWith('c_come') || c.id.startsWith('c_see') ||
                           c.id.startsWith('c_give') || c.id.startsWith('c_eat') ||
                           c.id.startsWith('c_drink') || c.id.startsWith('c_exist') ||
                           c.id.startsWith('c_notexist') || c.id.startsWith('c_want') ||
                           c.id.startsWith('act_') || 
                           c.id.startsWith('fo_') ||
                           (c.id.startsWith('f') && !c.id.startsWith('fo')) ||
                           c.id.startsWith('em');
            return !cIsVerb;
        });
    }

    
    
    State.selectedCards.push(card);
    
    // 문법 순서로 정렬: 대명사 → 주어 → 시간 → 장소 → 부사 → 목적어 → 동사
    sortCardsByGrammar();
    updateCurrentMessage();
    notifyListeners();
}
export function selectCardDirect(card) {
    // 이미 선택되어 있으면 무시
    if (State.selectedCards.some(c => c.id === card.id)) {
        return;
    }
    
    State.selectedCards.push(card);
    sortCardsByGrammar();
    updateCurrentMessage();
    notifyListeners();
}

// 문법 순서로 카드 정렬 (연구 기반 개선)
// 한국어 문법 순서 정렬
// 핵심: 조사는 바로 앞 단어에 붙음
// 사용자 선택 순서를 최대한 존중하되, 동사는 마지막으로
function sortCardsByGrammar() {
    if (State.selectedCards.length <= 1) return;
    
    // 동사/서술어 찾기
    const verbs = [];
    const nonVerbs = [];
    
    State.selectedCards.forEach(card => {
        const isVerb = card.grammarType === 'verb' || 
                       card.grammarType === 'question' ||
                       card.grammarType === 'request' ||
                       card.id.startsWith('act_') ||
                       card.id.startsWith('em');
        
        if (isVerb) {
            verbs.push(card);
        } else {
            nonVerbs.push(card);
        }
    });
    
    // 비동사 카드는 선택 순서 유지, 동사는 맨 뒤로
    State.selectedCards = [...nonVerbs, ...verbs];
}

// 카드 선택 해제
export function deselectCard(cardId) {
    State.selectedCards = State.selectedCards.filter(c => c.id !== cardId);
    updateCurrentMessage();
    notifyListeners();
}

// 선택 모두 해제
export function clearSelection() {
    State.selectedCards = [];
    State.currentMessage = '';
    notifyListeners();
}

// 현재 메시지 업데이트
// 조사(~이/가, ~을/를 등)는 앞 단어에 공백 없이 붙임
function updateCurrentMessage() {
    let message = '';
    const cards = State.selectedCards;
    
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const isParticle = card.grammarType === 'particle' || 
                          card.text.startsWith('~');
        
        if (isParticle && message.length > 0) {
            // 조사는 앞 단어에 공백 없이 붙임
            // ~이/가 → 이/가 (틸드 제거)
            const particleText = card.text.replace(/^~/, '');
            message += particleText;
        } else {
            // 일반 단어는 공백으로 구분
            if (message.length > 0) {
                message += ' ';
            }
            message += card.text;
        }
    }
    
    State.currentMessage = message;
}

// 기록에 추가
export function addToHistory(message) {
    if (!message) return;
    
    // 중복 제거 후 앞에 추가
    State.history = State.history.filter(m => m !== message);
    State.history.unshift(message);
    
    // 최대 50개까지만 저장
    if (State.history.length > 50) {
        State.history = State.history.slice(0, 50);
    }
    
    saveHistory();
    notifyListeners();
}

// 기록 삭제
export function clearHistory() {
    State.history = [];
    saveHistory();
    notifyListeners();
}

// 카드 순서 변경
export function reorderCards(category, fromIndex, toIndex) {
    if (State.cards[category]) {
        State.cards[category] = moveArrayItem(State.cards[category], fromIndex, toIndex);
        saveCardOrder();
        notifyListeners();
    }
}

// 사용자 카드 추가
export function addUserCard(category, cardData) {
    if (!State.userCards[category]) {
        State.userCards[category] = [];
    }
    
    State.userCards[category].push(cardData);
    State.cards[category].push(cardData);
    
    saveUserCards();
    saveCardOrder();
    notifyListeners();
}

// 사용자 카드 삭제
export function deleteUserCard(category, cardId) {
    if (State.userCards[category]) {
        State.userCards[category] = State.userCards[category].filter(c => c.id !== cardId);
    }
    
    if (State.cards[category]) {
        State.cards[category] = State.cards[category].filter(c => c.id !== cardId);
    }
    
    saveUserCards();
    saveCardOrder();
    notifyListeners();
}

// 카테고리 순서 변경
export function reorderCategories(fromIndex, toIndex) {
    State.categories = moveArrayItem(State.categories, fromIndex, toIndex);
    saveCategories();
    notifyListeners();
}

// 설정 업데이트
export function updateSettings(key, value) {
    State.settings[key] = value;
    applySettings();
    saveSettings();
    notifyListeners();
}

export default State;