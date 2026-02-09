/* ========================================
   app.js - 메인 앱 초기화
   수정사항:
   - 긴급 프리셋 누르면 바로 크게보기 발동
   - 크게보기 모달 X누르면 선택 카드 모두 초기화
   - 편집 모드 카드 재배치 작동
   - 글자 크기 설정시 카드 크기도 반응
======================================== */

import { 
    loadFromStorage, 
    getState, 
    setCurrentSlide, 
    setCurrentCategory,
    setEditMode,
    selectCard,
    selectCardDirect,
    deselectCard,
    clearSelection,
    addToHistory,
    clearHistory,
    reorderCards,
    addUserCard,
    deleteUserCard,
    updateSettings
} from './state.js';

import { CATEGORY_ICONS, VERB_SUGGESTIONS, EMERGENCY_CARDS, SITUATION_BOARDS } from './data/cards.js';
import { initTTS, speak, speakCard, stopSpeaking, startRepeat, stopRepeat } from './modules/tts.js';
import { initDragDrop } from './modules/drag-drop.js';
import { 
    showListenerModal, 
    closeListenerModal,
    showConfirmModal,
    closeConfirmModal,
    showAddCardModal,
    closeAddCardModal,
    confirmAddCard,
    initModalBackdropClose,
    setPictogramFunction
} from './modules/modal.js';
import { vibrate, debounce } from './utils/helpers.js';
import { PICTOGRAMS } from './data/pictograms.js';

// 새 모듈 (90점 달성용)
import ScanningModule from './modules/scanning.js';
import PhotoCardsModule from './modules/photoCards.js';
import SpeechSettingsModule from './modules/speechSettings.js';

// ========================================
// 추천 시스템
// ========================================

function showSuggestions(cardId) {
    const suggestionData = VERB_SUGGESTIONS[cardId];
    const suggestionBar = document.getElementById('suggestionBar');
    const suggestionChips = document.getElementById('suggestionChips');
    
    if (!suggestionData || !suggestionBar || !suggestionChips) {
        hideSuggestions();
        return;
    }
    
    const state = getState();
    
    const filteredSuggestions = suggestionData.suggestions.filter(
        sug => !state.selectedCards.some(c => c.id === sug.id)
    );
    
    if (filteredSuggestions.length === 0) {
        hideSuggestions();
        return;
    }
    
    suggestionChips.innerHTML = filteredSuggestions.map(sug => `
        <button class="suggestion-chip" data-id="${sug.id}" data-category="${sug.category}">
            ${sug.text}
        </button>
    `).join('');
    
    suggestionChips.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            vibrate();
            handleSuggestionClick(chip.dataset.id, chip.dataset.category);
        });
    });
    
    suggestionBar.classList.add('active');
}

function hideSuggestions() {
    const suggestionBar = document.getElementById('suggestionBar');
    if (suggestionBar) {
        suggestionBar.classList.remove('active');
    }
}

function handleSuggestionClick(cardId, category) {
    const state = getState();
    const allCards = state.cards[category] || [];
    const card = allCards.find(c => c.id === cardId);
    
    if (card) {
        if (state.selectedCards.some(c => c.id === cardId)) {
            return;
        }
        
        selectCardDirect(card);
        updateOutputBar();
        renderCards();
        renderEmergencyBar();
        hideSuggestions();
    }
}

// ========================================
// 렌더링 함수들
// ========================================

// 긴급 바 렌더링
function renderEmergencyBar() {
    const container = document.getElementById('emergencyChips');
    if (!container) return;
    
    const state = getState();
    
    container.innerHTML = EMERGENCY_CARDS.map(card => {
        const isSelected = state.selectedCards.some(c => c.id === card.id);
        return `
            <button class="emergency-chip ${isSelected ? 'selected' : ''}" 
                    data-id="${card.id}" 
                    data-category="${card.category}">
                ${card.text}
            </button>
        `;
    }).join('');
    
    container.querySelectorAll('.emergency-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            vibrate();
            handleEmergencyClick(chip.dataset.id, chip.dataset.category);
        });
    });
}

// ★ 긴급 카드 클릭 → 즉시 크게보기 발동
function handleEmergencyClick(cardId, category) {
    const state = getState();
    
    // EMERGENCY_CARDS에서 직접 카드 찾기
    const emergencyCard = EMERGENCY_CARDS.find(c => c.id === cardId);
    if (!emergencyCard) return;
    
    // 이미 선택되어 있으면 해제
    if (state.selectedCards.some(c => c.id === cardId)) {
        deselectCard(cardId);
        updateOutputBar();
        renderCards();
        renderEmergencyBar();
        return;
    }
    
    // 카드 선택 (grammarType 추가)
    selectCard({ 
        ...emergencyCard, 
        emergency: true,
        grammarType: 'verb'  // 긴급 카드는 서술어로 취급
    });
    updateOutputBar();
    renderCards();
    renderEmergencyBar();
    
    // ★ 즉시 크게보기 + TTS 발동
    const updatedState = getState();
    if (updatedState.currentMessage) {
        const hasEmergency = updatedState.selectedCards.some(c => c.emergency);
        showListenerModal(updatedState.currentMessage, hasEmergency, updatedState.selectedCards);
        startRepeat(updatedState.currentMessage, { maxRepeats: 5, interval: 3000, force: true });
        addToHistory(updatedState.currentMessage);
    }
}

// 카테고리 탭 렌더링
function renderCategories() {
    const container = document.getElementById('categoryBar');
    if (!container) return;
    
    const state = getState();
    
    container.innerHTML = state.categories.map(cat => `
        <button class="category-tab ${state.currentCategory === cat.id ? 'active' : ''}" 
                data-category="${cat.id}">
            ${CATEGORY_ICONS[cat.id] || ''}
            <span>${cat.name}</span>
        </button>
    `).join('');
    
    container.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            vibrate();
            setCurrentCategory(tab.dataset.category);
            renderCategories();
            renderCards();
        });
    });
}

// ★ 상황별 어휘판 적용 (새로 추가)
// 김영태 외(2003): 상황별 어휘 차이 47%
function applySituationBoard(situation) {
    const board = SITUATION_BOARDS[situation];
    if (!board) return;
    
    const container = document.getElementById('cardsGrid');
    if (!container) return;
    
    const state = getState();
    
    // 상황에 맞는 카드들만 필터링
    const allCards = [];
    Object.values(state.cards).forEach(categoryCards => {
        if (Array.isArray(categoryCards)) {
            allCards.push(...categoryCards);
        }
    });
    
    const situationCards = board.cards.map(cardId => {
        return allCards.find(c => c.id === cardId);
    }).filter(Boolean);
    
    container.innerHTML = situationCards.map(card => {
        const isSelected = state.selectedCards.some(c => c.id === card.id);
        const isEmergency = card.emergency;
        
        return `
            <div class="card ${isSelected ? 'selected' : ''} ${isEmergency ? 'emergency' : ''}"
                 data-id="${card.id}"
                 data-situation="${situation}">
                <div class="card-pictogram">
                    ${getPictogramSVG(card.pictogram)}
                </div>
                <span class="card-text">${card.text}</span>
            </div>
        `;
    }).join('');
    
    // 카드 이벤트 재바인딩
    bindCardEvents(container);
}

// 카드 렌더링
function renderCards() {
    const container = document.getElementById('cardsGrid');
    if (!container) return;
    
    const state = getState();
    const cards = state.cards[state.currentCategory] || [];
    
    container.innerHTML = cards.map(card => {
        const isSelected = state.selectedCards.some(c => c.id === card.id);
        const isUserCard = card.isUserCard;
        const isEmergency = card.emergency;
        
        return `
            <div class="card ${isSelected ? 'selected' : ''} ${isUserCard ? 'user-card' : ''} ${isEmergency ? 'emergency' : ''}"
                 data-id="${card.id}"
                 data-category="${state.currentCategory}">
                ${state.editMode && isUserCard ? `
                    <button class="card-delete-btn" data-id="${card.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                ` : ''}
                ${state.editMode ? `
                    <div class="card-drag-handle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
                            <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                        </svg>
                    </div>
                ` : ''}
                <div class="card-pictogram">
                    ${getPictogramSVG(card.pictogram)}
                </div>
                <div class="card-text">${card.text}</div>
            </div>
        `;
    }).join('');
    
    // 편집 모드일 때만 카드 추가 버튼
    if (state.editMode) {
        container.innerHTML += `
            <div class="card-add" id="addCardBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>추가</span>
            </div>
        `;
    } else {
        container.innerHTML += `
            <div class="card-add" id="addCardBtn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>추가</span>
            </div>
        `;
    }
    
    // 이벤트 바인딩
    bindCardEvents(container);
    renderEmergencyBar();
}

// 카드 이벤트 바인딩
function bindCardEvents(container) {
    const state = getState();
    
    // 카드 클릭
    container.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.card-delete-btn')) return;
            if (e.target.closest('.card-drag-handle')) return;
            // 편집 모드에서는 클릭 대신 드래그
            if (state.editMode) return;
            
            vibrate();
            handleCardClick(card.dataset.id);
        });
    });
    
    // 삭제 버튼
    container.querySelectorAll('.card-delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            vibrate();
            
            const confirmed = await showConfirmModal('이 카드를 삭제할까요?');
            if (confirmed) {
                deleteUserCard(state.currentCategory, btn.dataset.id);
                renderCards();
            }
        });
    });
    
    // 카드 추가 버튼
    const addBtn = document.getElementById('addCardBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            vibrate();
            showAddCardModal(state.currentCategory, (cardData) => {
                addUserCard(state.currentCategory, cardData);
                renderCards();
            });
        });
    }
    
    // ★ 편집 모드에서 드래그 앤 드롭 초기화
    if (state.editMode) {
        // 짧은 딜레이 후 초기화 (DOM 렌더링 완료 대기)
        requestAnimationFrame(() => {
            initDragDrop(container, {
                itemSelector: '.card',
                enabled: () => getState().editMode,
                onReorder: (from, to) => {
                    reorderCards(getState().currentCategory, from, to);
                    renderCards();
                },
                longPressDuration: 300
            });
        });
    }
}

// 카드 클릭 핸들러
function handleCardClick(cardId) {
    const state = getState();
    
    // 먼저 현재 카테고리에서 찾기
    let cards = state.cards[state.currentCategory] || [];
    let card = cards.find(c => c.id === cardId);
    
    // 현재 카테고리에서 못 찾으면 전체 카드에서 찾기 (상황판 대응)
    if (!card) {
        const allCards = [];
        Object.values(state.cards).forEach(categoryCards => {
            if (Array.isArray(categoryCards)) {
                allCards.push(...categoryCards);
            }
        });
        card = allCards.find(c => c.id === cardId);
    }
    
    if (!card) return;
    
    if (state.selectedCards.some(c => c.id === cardId)) {
        deselectCard(cardId);
        hideSuggestions();
    } else {
        selectCard(card);
        speakCard(card.text);
        showSuggestions(cardId);
        trackCardUsage(card.text);
    }
    
    updateOutputBar();
    renderCards();
    renderEmergencyBar();
    
    // 상황판 활성화 상태면 다시 렌더링
    const activeSituation = document.querySelector('.situation-chip.active');
    if (activeSituation && activeSituation.dataset.situation) {
        applySituationBoard(activeSituation.dataset.situation);
    }
}

// 출력 바 업데이트
function updateOutputBar() {
    const state = getState();
    const outputText = document.getElementById('outputText');
    const speakBtn = document.getElementById('speakBtn');
    const showBtn = document.getElementById('showBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    if (state.currentMessage) {
        outputText.textContent = state.currentMessage;
        outputText.classList.remove('empty');
        outputText.classList.add('has-message');
        speakBtn.disabled = false;
        showBtn.disabled = false;
        clearBtn.disabled = false;
    } else {
        outputText.textContent = '카드를 선택하세요';
        outputText.classList.add('empty');
        outputText.classList.remove('has-message');
        speakBtn.disabled = true;
        showBtn.disabled = true;
        clearBtn.disabled = true;
        hideSuggestions();
    }
}

// 기록 렌더링
function renderHistory() {
    const container = document.getElementById('historyContainer');
    if (!container) return;
    
    const state = getState();
    
    if (state.history.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                </svg>
                <p>아직 사용 기록이 없습니다</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.history.map(msg => `
        <div class="history-item" data-message="${msg}">
            <span>${msg}</span>
        </div>
    `).join('');
    
    container.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            vibrate();
            speak(item.dataset.message);
            showListenerModal(item.dataset.message);
        });
    });
}

// 픽토그램 SVG 가져오기
function getPictogramSVG(pictogramId) {
    return PICTOGRAMS[pictogramId] || PICTOGRAMS['default'] || `
        <svg viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="#F5F5F5"/>
            <circle cx="32" cy="32" r="20" fill="#E0E0E0"/>
            <text x="32" y="38" text-anchor="middle" font-size="16" fill="#757575">?</text>
        </svg>
    `;
}

// ========================================
// 이벤트 리스너 설정
// ========================================
function setupEventListeners() {
    // 하단 탭 바
    document.querySelectorAll('.tab-bar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            vibrate();
            const slide = parseInt(btn.dataset.slide);
            goToSlide(slide);
        });
    });
    
    // ★ 편집 모드 버튼 - 개선
    const editBtn = document.getElementById('editModeBtn');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            vibrate();
            const state = getState();
            const newEditMode = !state.editMode;
            setEditMode(newEditMode);
            
            const header = document.getElementById('appHeader');
            const cardsArea = document.querySelector('.cards-area');
            
            if (header) {
                header.classList.toggle('edit-mode', newEditMode);
            }
            if (cardsArea) {
                cardsArea.classList.toggle('edit-mode', newEditMode);
            }
            
            hideSuggestions();
            renderCategories();
            renderCards();
        });
    }
    
    // 출력 바 버튼들
    document.getElementById('speakBtn')?.addEventListener('click', () => {
        const state = getState();
        if (state.currentMessage) {
            vibrate();
            speak(state.currentMessage);
            addToHistory(state.currentMessage);
        }
    });
    
    document.getElementById('showBtn')?.addEventListener('click', () => {
        const state = getState();
        if (state.currentMessage) {
            vibrate();
            const hasEmergency = state.selectedCards.some(c => c.emergency);
            showListenerModal(state.currentMessage, hasEmergency, state.selectedCards);
            startRepeat(state.currentMessage, { maxRepeats: 3, interval: 5000 });
            addToHistory(state.currentMessage);
        }
    });
    
    document.getElementById('clearBtn')?.addEventListener('click', () => {
        vibrate();
        clearSelection();
        updateOutputBar();
        renderCards();
        renderEmergencyBar();
        hideSuggestions();
    });
    
    // 추천 닫기 버튼
    document.getElementById('closeSuggestion')?.addEventListener('click', () => {
        vibrate();
        hideSuggestions();
    });
    
    // ★ 청자 모달 닫기 → 선택 모두 초기화
    document.getElementById('closeListenerModal')?.addEventListener('click', () => {
        vibrate();
        closeListenerModal();
        stopSpeaking();
        stopRepeat();
        
        // 선택된 카드 모두 초기화
        clearSelection();
        updateOutputBar();
        renderCards();
        renderEmergencyBar();
        hideSuggestions();
    });
    
    // 기록 삭제
    document.getElementById('clearHistoryBtn')?.addEventListener('click', async () => {
        vibrate();
        const state = getState();
        const hasFreq = localStorage.getItem('aac_card_freq');
        if (state.history.length === 0 && !hasFreq) return;
        
        const confirmed = await showConfirmModal('모든 기록과 통계를 삭제할까요?');
        if (confirmed) {
            clearHistory();
            try { localStorage.removeItem('aac_card_freq'); } catch(e) {}
            renderHistory();
            renderStats();
        }
    });
    
    // 확인 모달 버튼
    document.getElementById('confirmCancel')?.addEventListener('click', () => {
        vibrate();
        closeConfirmModal(false);
    });
    
    document.getElementById('confirmOk')?.addEventListener('click', () => {
        vibrate();
        closeConfirmModal(true);
    });
    
    // 카드 추가 모달
    document.getElementById('closeAddCardModal')?.addEventListener('click', () => {
        vibrate();
        closeAddCardModal();
    });
    
    document.getElementById('cancelAddCard')?.addEventListener('click', () => {
        vibrate();
        closeAddCardModal();
    });
    
    document.getElementById('confirmAddCard')?.addEventListener('click', () => {
        vibrate();
        confirmAddCard();
    });
    
    // 설정 토글들
    document.getElementById('highContrastToggle')?.addEventListener('change', (e) => {
        vibrate();
        updateSettings('highContrast', e.target.checked);
    });
    
    document.getElementById('darkModeToggle')?.addEventListener('change', (e) => {
        vibrate();
        updateSettings('darkMode', e.target.checked);
    });
    
    // ★ 글자 크기 변경 → 카드도 리렌더링
    document.getElementById('fontSizeSelect')?.addEventListener('change', (e) => {
        vibrate();
        updateSettings('fontSize', e.target.value);
        renderCards();
    });
    
    document.getElementById('vibrationToggle')?.addEventListener('change', (e) => {
        vibrate();
        updateSettings('vibration', e.target.checked);
    });
    
    // 검색
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('input', debounce((e) => {
        handleSearch(e.target.value);
    }, 300));
    
    // 모달 배경 클릭으로 닫기
    initModalBackdropClose();
    
    // 스와이프 제스처
    setupSwipeGestures();
}

// 슬라이드 이동
function goToSlide(index) {
    setCurrentSlide(index);
    
    const wrapper = document.getElementById('slideWrapper');
    wrapper.style.transform = `translateX(-${index * 100}%)`;
    
    document.querySelectorAll('.tab-bar-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
    });
    
    if (index === 2) {
        renderHistory();
        renderStats();
    }
    
    // 헤더: 말하기 화면에서만 편집/검색 표시
    const header = document.getElementById('appHeader');
    if (header) {
        header.style.display = (index === 0) ? '' : 'flex';
    }
    
    // 출력바: 말하기/상황에서만
    const outputBar = document.querySelector('.output-bar');
    if (outputBar) {
        outputBar.style.display = (index <= 1) ? '' : 'none';
    }
    
    // 스캐닝 터치 버튼: 말하기(0) + 상황판(1)에서 표시
    const touchOverlay = document.getElementById('scanTouchOverlay');
    if (touchOverlay) {
        touchOverlay.style.display = (index <= 1) ? 'flex' : 'none';
    }
}

// 스와이프 제스처
function setupSwipeGestures() {
    const container = document.querySelector('.slide-container');
    if (!container) return;
    
    let startX = 0;
    let startY = 0;
    let startTarget = null;
    
    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTarget = e.target;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        // 스와이프 거리 계산
        const diffX = startX - endX;
        const diffY = Math.abs(startY - endY);
        
        // 스와이프 제외 영역 확인
        // 카테고리 바, 긴급 바, 상황 바, 추천 바에서 시작된 스와이프는 무시
        const excludeSelectors = [
            '.category-bar',
            '.emergency-bar', 
            '.situation-bar',
            '.suggestion-bar',
            '.cards-area'  // 카드 영역에서의 좌우 스와이프도 제외
        ];
        
        const isExcluded = excludeSelectors.some(selector => {
            return startTarget && startTarget.closest(selector);
        });
        
        if (isExcluded) return;
        
        // 스와이프 임계값: 가로 150px 이상, 세로 80px 이하
        // (이전: 가로 80px, 세로 100px)
        if (Math.abs(diffX) > 150 && diffY < 80) {
            const state = getState();
            if (diffX > 0 && state.currentSlide < 3) {
                goToSlide(state.currentSlide + 1);
            } else if (diffX < 0 && state.currentSlide > 0) {
                goToSlide(state.currentSlide - 1);
            }
        }
    }, { passive: true });
}

// 검색 처리
function handleSearch(query) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    
    if (!query.trim()) {
        container.innerHTML = '';
        return;
    }
    
    const state = getState();
    const results = [];
    
    Object.entries(state.cards).forEach(([category, cards]) => {
        cards.forEach(card => {
            if (card.text.toLowerCase().includes(query.toLowerCase())) {
                results.push({ ...card, category });
            }
        });
    });
    
    const historyResults = state.history.filter(msg => 
        msg.toLowerCase().includes(query.toLowerCase())
    );
    
    if (results.length === 0 && historyResults.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>검색 결과가 없습니다</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    if (historyResults.length > 0) {
        html += `<div class="section-title">기록</div>`;
        html += historyResults.slice(0, 5).map(msg => `
            <div class="history-item" data-message="${msg}">
                <span>${msg}</span>
            </div>
        `).join('');
    }
    
    if (results.length > 0) {
        html += `<div class="section-title">카드</div>`;
        html += results.slice(0, 10).map(card => `
            <div class="search-result" data-id="${card.id}" data-category="${card.category}">
                <span>${card.text}</span>
            </div>
        `).join('');
    }
    
    container.innerHTML = html;
    
    container.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            vibrate();
            speak(item.dataset.message);
        });
    });
    
    container.querySelectorAll('.search-result').forEach(item => {
        item.addEventListener('click', () => {
            vibrate();
            const cardId = item.dataset.id;
            setCurrentCategory(item.dataset.category);
            
            // 검색 팝업 닫기
            const popup = document.getElementById('searchPopup');
            if (popup) popup.style.display = 'none';
            const input = document.getElementById('searchInput');
            if (input) input.value = '';
            const results = document.getElementById('searchResults');
            if (results) results.innerHTML = '';
            
            goToSlide(0);
            renderCategories();
            renderCards();
            
            // 해당 카드에 발광 효과
            setTimeout(() => {
                const cardEl = document.querySelector(`.card[data-id="${cardId}"]`);
                if (cardEl) {
                    cardEl.classList.add('search-highlight');
                    cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => cardEl.classList.remove('search-highlight'), 2000);
                }
            }, 150);
        });
    });
}

// 설정 로드 후 UI 업데이트
function syncSettingsUI() {
    const state = getState();
    
    const highContrastToggle = document.getElementById('highContrastToggle');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    const vibrationToggle = document.getElementById('vibrationToggle');
    
    if (highContrastToggle) highContrastToggle.checked = state.settings.highContrast;
    if (darkModeToggle) darkModeToggle.checked = state.settings.darkMode;
    if (fontSizeSelect) fontSizeSelect.value = state.settings.fontSize;
    if (vibrationToggle) vibrationToggle.checked = state.settings.vibration;
}

// ========================================
// 앱 초기화
// ========================================
// ========================================
// 빈도 그래프
// ========================================
function renderStats() {
    const chart = document.getElementById('statsChart');
    const summary = document.getElementById('statsSummary');
    if (!chart) return;
    
    // 카드 사용 빈도 계산 (localStorage에서)
    const freq = JSON.parse(localStorage.getItem('aac_card_freq') || '{}');
    const entries = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 8);
    
    if (entries.length === 0) {
        chart.innerHTML = '<div class="empty-state" style="font-size:13px;color:#9CA3AF;text-align:center;width:100%;padding:20px 0;">아직 데이터가 없습니다</div>';
        if (summary) summary.textContent = '';
        return;
    }
    
    const maxCount = entries[0][1];
    const colors = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#84CC16'];
    
    chart.innerHTML = entries.map(([text, count], i) => {
        const h = Math.max(8, (count / maxCount) * 80);
        return `<div class="chart-bar-wrapper">
            <span class="chart-count">${count}</span>
            <div class="chart-bar" style="height:${h}px;background:${colors[i % colors.length]}"></div>
            <span class="chart-label">${text}</span>
        </div>`;
    }).join('');
    
    const totalUses = Object.values(freq).reduce((a,b) => a+b, 0);
    const totalWords = Object.keys(freq).length;
    if (summary) {
        summary.textContent = `총 ${totalUses}회 사용 · ${totalWords}개 단어 · 가장 많이: "${entries[0][0]}" (${entries[0][1]}회)`;
    }
}

function trackCardUsage(cardText) {
    const freq = JSON.parse(localStorage.getItem('aac_card_freq') || '{}');
    freq[cardText] = (freq[cardText] || 0) + 1;
    localStorage.setItem('aac_card_freq', JSON.stringify(freq));
}

// ========================================
// 상황판 렌더링 (슬라이드 1)
// ========================================
function setupSituationBoard() {
    document.querySelectorAll('.situation-card').forEach(card => {
        card.addEventListener('click', () => {
            vibrate();
            const situation = card.dataset.situation;
            showSituationCards(situation);
        });
    });
    
    document.getElementById('situationBackBtn')?.addEventListener('click', () => {
        vibrate();
        hideSituationCards();
    });
}

function showSituationCards(situation) {
    const board = SITUATION_BOARDS[situation];
    if (!board) return;
    
    document.getElementById('situationGrid').style.display = 'none';
    const area = document.getElementById('situationCardsArea');
    area.style.display = 'block';
    document.getElementById('situationTitle').textContent = board.name;
    
    const grid = document.getElementById('situationCardsGrid');
    const state = getState();
    const allCards = [];
    Object.values(state.cards).forEach(cc => { if (Array.isArray(cc)) allCards.push(...cc); });
    
    const situationCards = board.cards.map(id => allCards.find(c => c.id === id)).filter(Boolean);
    
    grid.innerHTML = situationCards.map(card => {
        const isSelected = state.selectedCards.some(c => c.id === card.id);
        return `<div class="card ${isSelected ? 'selected' : ''}" data-id="${card.id}" data-situation="${situation}">
            <div class="card-pictogram">${getPictogramSVG(card.pictogram)}</div>
            <span class="card-text">${card.text}</span>
        </div>`;
    }).join('');
    
    bindCardEvents(grid);
}

function hideSituationCards() {
    document.getElementById('situationGrid').style.display = 'grid';
    document.getElementById('situationCardsArea').style.display = 'none';
}

// ========================================
// 검색 팝업
// ========================================
function setupSearchPopup() {
    const popup = document.getElementById('searchPopup');
    const btn = document.getElementById('searchBtn');
    const closeBtn = document.getElementById('searchCloseBtn');
    const input = document.getElementById('searchInput');
    
    btn?.addEventListener('click', () => {
        popup.style.display = 'flex';
        setTimeout(() => input?.focus(), 100);
    });
    
    closeBtn?.addEventListener('click', () => {
        popup.style.display = 'none';
        if (input) input.value = '';
        const results = document.getElementById('searchResults');
        if (results) results.innerHTML = '';
    });
    
    popup?.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
        }
    });
}

function init() {
    console.log('🚀 AAC 3.0 초기화 중...');
    
    loadFromStorage();
    initTTS();
    setPictogramFunction(getPictogramSVG);
    setupEventListeners();
    
    // 새 모듈 초기화 (90점 달성용)
    ScanningModule.init();
    PhotoCardsModule.init();
    SpeechSettingsModule.init();
    
    // 커스텀 카드 이벤트 리스너
    document.addEventListener('customCardAdded', (e) => {
        console.log('커스텀 카드 추가됨:', e.detail);
        renderCards();
    });
    
    document.addEventListener('customCardDeleted', (e) => {
        console.log('커스텀 카드 삭제됨:', e.detail);
        renderCards();
    });
    
    renderCategories();
    renderEmergencyBar();
    renderCards();
    updateOutputBar();
    syncSettingsUI();
    setupSituationBoard();
    setupSearchPopup();
    setupMainMenu();
    setupHomeButton();
    
    console.log('✅ AAC 3.0 초기화 완료');
    
    // 스플래시 스크린 숨기기
    hideSplashScreen();
}

// 스플래시 스크린 → 메인 메뉴 표시
function hideSplashScreen() {
    const splash = document.getElementById('splashScreen');
    const menu = document.getElementById('mainMenu');
    
    if (!splash || !menu) return;
    
    setTimeout(() => {
        menu.style.display = 'flex';
        splash.classList.add('hidden');
        
        setTimeout(() => splash.remove(), 500);
    }, 2000);
}

// 메인 메뉴 → 앱 진입
function setupMainMenu() {
    const menu = document.getElementById('mainMenu');
    const app = document.getElementById('app');
    if (!menu) return;
    
    const slideMap = { speak: 0, situation: 1, history: 2, settings: 3 };
    
    menu.querySelectorAll('.menu-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const target = tile.dataset.target;
            const slideIndex = slideMap[target] ?? 0;
            
            // 메뉴 숨기고 앱 표시
            menu.style.display = 'none';
            app.style.display = 'flex';
            
            // 해당 슬라이드로 이동
            goToSlide(slideIndex);
        });
    });
}

// 홈 버튼 (로고 클릭) → 메인 메뉴로 돌아가기
function setupHomeButton() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            const menu = document.getElementById('mainMenu');
            const app = document.getElementById('app');
            if (menu && app) {
                app.style.display = 'none';
                menu.style.display = 'flex';
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

export default { init };
