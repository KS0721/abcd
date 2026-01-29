// ========================================
// ui.js - 카드 렌더링, 모달, 슬라이드, UI
// ========================================
console.log('🎨 ui.js 로드됨');

// ========================================
// 진동
// ========================================
function vibrate(duration = 50) {
    const settings = JSON.parse(localStorage.getItem('aac_settings') || '{}');
    const vibrationEnabled = settings.vibration !== false;
    
    if (vibrationEnabled && 'vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// ========================================
// 슬라이드 네비게이션
// ========================================
function goToSlide(index) {
    const wrapper = document.getElementById('slideWrapper');
    const tabs = document.querySelectorAll('.tab-bar-btn');
    
    State.currentSlide = index;
    wrapper.style.transform = `translateX(-${index * 100}%)`;
    
    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });
    
    if (index === 1) renderHistory();
    
    lucide.createIcons();
}

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 80;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0 && State.currentSlide < 3) {
            goToSlide(State.currentSlide + 1);
        } else if (diff < 0 && State.currentSlide > 0) {
            goToSlide(State.currentSlide - 1);
        }
    }
}

// ========================================
// TTS
// ========================================
function speak(text) {
    if ('speechSynthesis' in window && text) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
}

// ========================================
// 출력 바 업데이트
// ========================================
function updateOutputBar() {
    const sentence = buildSentence();
    const outputText = document.getElementById('outputText');
    const speakBtn = document.getElementById('speakBtn');
    const showBtn = document.getElementById('showBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    if (sentence) {
        outputText.innerHTML = sentence;
        outputText.classList.add('has-message');
        speakBtn.disabled = false;
        showBtn.disabled = false;
        clearBtn.disabled = false;
        State.currentMessage = sentence;
        
        // 아이콘 결정 - 우선순위: predicate > need > food > place > person > time > 기본값
        if (Selection.predicate && Selection.predicate.icon) {
            State.currentIcon = Selection.predicate.icon;
        } else if (Selection.need && Selection.need.icon) {
            State.currentIcon = Selection.need.icon;
        } else if (Selection.food && Selection.food.length > 0 && Selection.food[0].icon) {
            State.currentIcon = Selection.food[0].icon;
        } else if (Selection.place && Selection.place.length > 0 && Selection.place[0].icon) {
            State.currentIcon = Selection.place[0].icon;
        } else if (Selection.person && Selection.person.length > 0 && Selection.person[0].icon) {
            State.currentIcon = Selection.person[0].icon;
        } else if (Selection.time && Selection.time.icon) {
            State.currentIcon = Selection.time.icon;
        } else {
            State.currentIcon = 'message-circle';
        }
    } else {
        outputText.innerHTML = '<span class="placeholder">카드를 선택하세요</span>';
        outputText.classList.remove('has-message');
        speakBtn.disabled = true;
        showBtn.disabled = true;
        clearBtn.disabled = true;
        State.currentMessage = '';
        State.currentIcon = 'message-circle';
    }
    
    updateCardStyles();
}

function updateCardStyles() {
    document.querySelectorAll('.card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const allSelected = [];
    
    if (Selection.time) {
        allSelected.push({ text: Selection.time.text, category: 'time' });
    }
    
    if (Selection.place && Array.isArray(Selection.place)) {
        Selection.place.forEach(item => {
            allSelected.push({ text: item.text, category: 'place' });
        });
    }
    
    if (Selection.person && Array.isArray(Selection.person)) {
        Selection.person.forEach(item => {
            allSelected.push({ text: item.text, category: 'person' });
        });
    }
    
    if (Selection.food && Array.isArray(Selection.food)) {
        Selection.food.forEach(item => {
            allSelected.push({ text: item.text, category: 'food' });
        });
    }
    
    if (Selection.need) {
        allSelected.push({ text: Selection.need.text, category: 'need' });
    }
    
    // predicate는 원본 텍스트로 비교 (pain 카테고리의 경우 originalText 사용)
    if (Selection.predicate) {
        const originalText = Selection.predicate.originalText || Selection.predicate.text;
        allSelected.push({ text: originalText, category: Selection.predicate.category });
    }
    
    allSelected.forEach(item => {
        document.querySelectorAll('.card').forEach(card => {
            const cardText = card.dataset.text;
            const cardCategory = card.dataset.category;
            
            if (cardText === item.text && cardCategory === item.category) {
                card.classList.add('selected');
            }
        });
    });
}

// ========================================
// 추천 탭 관리
// ========================================
function showSuggestionTab(predicateText) {
    const suggestion = VERB_SUGGESTIONS[predicateText];
    
    if (!suggestion || !suggestion.show) {
        hideSuggestionTab();
        return;
    }
    
    State.showSuggestions = true;
    State.currentPredicate = predicateText;
    
    const categoryTabs = document.querySelector('.category-tabs');
    let suggestionTab = document.getElementById('suggestionTab');
    
    if (!suggestionTab) {
        suggestionTab = document.createElement('button');
        suggestionTab.id = 'suggestionTab';
        suggestionTab.className = 'tab-btn suggestion-tab';
        suggestionTab.dataset.category = 'suggestion';
        suggestionTab.innerHTML = `<i data-lucide="sparkles"></i><span>추천</span>`;
        suggestionTab.addEventListener('click', () => {
            vibrate();
            document.querySelectorAll('.category-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            suggestionTab.classList.add('active');
            renderSuggestionCards(predicateText);
        });
        categoryTabs.insertBefore(suggestionTab, categoryTabs.firstChild);
    }
    
    document.querySelectorAll('.category-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    suggestionTab.classList.add('active');
    renderSuggestionCards(predicateText);
    
    suggestionTab.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    
    lucide.createIcons();
}

function hideSuggestionTab() {
    State.showSuggestions = false;
    State.currentPredicate = null;
    const suggestionTab = document.getElementById('suggestionTab');
    if (suggestionTab) {
        suggestionTab.remove();
    }
}

function renderSuggestionCards(predicateText) {
    const container = document.getElementById('cardsContainer');
    if (!container) return;
    
    const suggestion = VERB_SUGGESTIONS[predicateText];
    if (!suggestion || !suggestion.show) return;
    
    container.innerHTML = '';
    
    suggestion.categories.forEach(category => {
        let allCards = getCardData(category);
        
        if (category === 'food' && suggestion.foodFilter) {
            allCards = allCards.filter(card => card.type === suggestion.foodFilter);
        }
        
        allCards.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card suggestion-card';
            card.dataset.text = item.text;
            card.dataset.category = category;
            card.dataset.icon = item.icon;
            card.innerHTML = `
                <div class="card-icon"><i data-lucide="${item.icon}"></i></div>
                <div class="card-text">${item.text}</div>
            `;
            
            card.addEventListener('click', () => {
                vibrate();
                handleCardSelect(category, item, item.text);
            });
            
            container.appendChild(card);
        });
    });
    
    const painScale = document.getElementById('painScale');
    if (painScale) painScale.classList.add('hidden');
    
    lucide.createIcons();
    updateCardStyles();
}

// ========================================
// 카드 렌더링
// ========================================
function renderCards(category) {
    const container = document.getElementById('cardsContainer');
    if (!container) return;
    
    State.currentCategory = category;
    const cards = getCardData(category);
    const userCardTexts = (State.userCards[category] || []).map(c => c.text);
    
    container.innerHTML = '';
    
    cards.forEach(item => {
        let displayText = item.text;
        
        // pain 카테고리 텍스트 변환
        if (category === 'pain') {
            if (!['어지러움', '토할 것 같음', '추움', '열남'].includes(item.text)) {
                displayText = item.text + ' 아파요';
            } else if (item.text === '어지러움') displayText = '어지러워요';
            else if (item.text === '토할 것 같음') displayText = '토할 것 같아요';
            else if (item.text === '추움') displayText = '추워요';
            else if (item.text === '열남') displayText = '열나요';
        }
        
        const isUserCard = userCardTexts.includes(item.text);
        
        const card = document.createElement('div');
        card.className = `card${isUserCard ? ' user-card' : ''}`;
        card.dataset.text = item.text;  // 원본 텍스트 저장 (비교용)
        card.dataset.category = category;
        card.dataset.icon = item.icon;
        card.innerHTML = `
            <div class="card-icon"><i data-lucide="${item.icon}"></i></div>
            <div class="card-text">${displayText}</div>
            ${isUserCard ? `<button class="delete-btn" title="삭제"><i data-lucide="x"></i></button>` : ''}
        `;
        
        card.addEventListener('click', (e) => {
            if (e.target.closest('.delete-btn')) return;
            vibrate();
            
            // pain 카테고리는 originalText를 함께 전달
            if (category === 'pain') {
                handleCardSelect(category, { ...item, originalText: item.text, displayText }, displayText);
            } else {
                handleCardSelect(category, { ...item, displayText }, displayText);
            }
        });
        
        if (isUserCard) {
            card.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                vibrate();
                deleteUserCard(category, item.text);
            });
        }
        
        setupLongPress(card, displayText, item.icon);
        
        container.appendChild(card);
    });
    
    const addBtn = document.createElement('div');
    addBtn.className = 'add-card-btn';
    addBtn.innerHTML = `<i data-lucide="plus"></i><span>추가</span>`;
    addBtn.addEventListener('click', () => {
        vibrate();
        openAddCardModal(category);
    });
    container.appendChild(addBtn);
    
    const painScale = document.getElementById('painScale');
    if (painScale) painScale.classList.toggle('hidden', category !== 'pain');
    
    lucide.createIcons();
    updateCardStyles();
}

// ========================================
// 통증 버튼 생성
// ========================================
function createPainButtons() {
    const container = document.getElementById('painButtons');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'pain-btn';
        btn.dataset.level = i;
        btn.textContent = i;
        
        btn.addEventListener('click', () => {
            vibrate();
            document.querySelectorAll('.pain-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            State.selectedPainLevel = i;
            updatePainMessage();
        });
        
        container.appendChild(btn);
    }
}

// ========================================
// 기록 렌더링
// ========================================
function renderHistory() {
    const container = document.getElementById('historyContainer');
    if (!container) return;
    
    if (State.sentenceHistory.length === 0) {
        container.innerHTML = '<p class="empty-message">아직 사용 기록이 없습니다</p>';
        return;
    }
    
    container.innerHTML = State.sentenceHistory.map(sentence => `
        <div class="history-item" data-text="${sentence}">
            <div class="icon"><i data-lucide="message-square"></i></div>
            <div class="text">${sentence}</div>
        </div>
    `).join('');
    
    container.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
            vibrate();
            const text = item.dataset.text;
            clearSelection();
            Selection.predicate = { text, icon: 'history', displayText: text, category: 'history' };
            updateOutputBar();
            speak(text);
            goToSlide(0);
        });
    });
    
    lucide.createIcons();
}

// ========================================
// 롱프레스 메뉴
// ========================================
let longPressTimer = null;

function setupLongPress(card, text, icon) {
    const startPress = (e) => {
        if (e.target.closest('.delete-btn')) return;
        
        longPressTimer = setTimeout(() => {
            vibrate(100);
            showLongPressMenu(text, icon, e);
        }, 500);
    };
    
    const endPress = () => clearTimeout(longPressTimer);
    
    card.addEventListener('mousedown', startPress);
    card.addEventListener('mouseup', endPress);
    card.addEventListener('mouseleave', endPress);
    card.addEventListener('touchstart', startPress, { passive: true });
    card.addEventListener('touchend', endPress);
    card.addEventListener('touchcancel', endPress);
}

function showLongPressMenu(text, icon, e) {
    const conjugation = verbConjugations[text];
    if (!conjugation) return;
    
    closeLongPressMenu();
    
    const overlay = document.getElementById('longpressOverlay');
    const menu = document.getElementById('longpressMenu');
    
    overlay.classList.remove('hidden');
    menu.classList.remove('hidden');
    
    menu.innerHTML = `
        <div class="longpress-menu-header">${text}</div>
        <div class="longpress-menu-section">
            <div class="longpress-menu-label">시제</div>
            <div class="longpress-menu-item selected" data-text="${text}" data-icon="${icon}">${text} <span class="tag">현재</span></div>
            <div class="longpress-menu-item" data-text="${conjugation.past}" data-icon="${icon}">${conjugation.past} <span class="tag">과거</span></div>
            <div class="longpress-menu-item" data-text="${conjugation.future}" data-icon="${icon}">${conjugation.future} <span class="tag">미래</span></div>
        </div>
        <div class="longpress-menu-section">
            <div class="longpress-menu-label">존댓말</div>
            <div class="longpress-menu-item" data-text="${conjugation.casual}" data-icon="${icon}">${conjugation.casual} <span class="tag">반말</span></div>
            <div class="longpress-menu-item" data-text="${conjugation.formal}" data-icon="${icon}">${conjugation.formal} <span class="tag">높임</span></div>
        </div>
    `;
    
    const rect = e.target.closest('.card').getBoundingClientRect();
    menu.style.left = `${Math.min(rect.left, window.innerWidth - 200)}px`;
    menu.style.top = `${Math.max(rect.top - 200, 10)}px`;
    
    menu.querySelectorAll('.longpress-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            vibrate();
            const itemIcon = item.dataset.icon || icon;
            Selection.predicate = { text: item.dataset.text, icon: itemIcon, displayText: item.dataset.text, category: 'action' };
            updateOutputBar();
            closeLongPressMenu();
        });
    });
    
    overlay.addEventListener('click', closeLongPressMenu);
}

function closeLongPressMenu() {
    document.getElementById('longpressOverlay')?.classList.add('hidden');
    document.getElementById('longpressMenu')?.classList.add('hidden');
}

// ========================================
// 청자 모드 모달
// ========================================
function showListenerModal(text, icon, isEmergency = false) {
    const modal = document.getElementById('listenerModal');
    const iconEl = document.getElementById('listenerIcon');
    const textEl = document.getElementById('listenerText');
    
    if (!modal || !iconEl || !textEl) {
        console.error('청자 모달 요소를 찾을 수 없음');
        return;
    }
    
    // 기존 모드 클래스 제거
    modal.classList.remove('normal-mode', 'emergency-mode');
    
    // 긴급 여부에 따라 클래스 추가
    if (isEmergency) {
        modal.classList.add('emergency-mode');
    } else {
        modal.classList.add('normal-mode');
    }
    
    // 아이콘이 없거나 기본값이면 State.currentIcon 사용
    const displayIcon = icon && icon !== 'message-circle' ? icon : State.currentIcon;
    
    // 아이콘 크기 크게 설정
    iconEl.innerHTML = `<i data-lucide="${displayIcon}" style="width: 120px; height: 120px; stroke-width: 1.5;"></i>`;
    textEl.textContent = text;
    modal.classList.remove('hidden');
    
    lucide.createIcons();
}

function closeListenerModal() {
    document.getElementById('listenerModal')?.classList.add('hidden');
    
    // 선택 초기화
    clearSelection();
    State.currentMessage = '';
    State.currentIcon = 'message-circle';
    State.selectedPainPart = null;
    State.selectedPainLevel = null;
    updateOutputBar();
}

// ========================================
// 카드 추가 모달
// ========================================
let addingToCategory = 'action';
let selectedIconForNewCard = 'message-circle';

function openAddCardModal(category) {
    addingToCategory = category;
    selectedIconForNewCard = 'message-circle';
    
    const modal = document.getElementById('addCardModal');
    const iconSelector = document.getElementById('iconSelector');
    const textInput = document.getElementById('newCardText');
    
    textInput.value = '';
    
    iconSelector.innerHTML = availableIcons.map(icon => `
        <div class="icon-option ${icon === selectedIconForNewCard ? 'selected' : ''}" data-icon="${icon}">
            <i data-lucide="${icon}"></i>
        </div>
    `).join('');
    
    iconSelector.querySelectorAll('.icon-option').forEach(opt => {
        opt.addEventListener('click', () => {
            vibrate();
            iconSelector.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedIconForNewCard = opt.dataset.icon;
            updateCardPreview();
        });
    });
    
    updateCardPreview();
    modal.classList.remove('hidden');
    lucide.createIcons();
}

function closeAddCardModal() {
    document.getElementById('addCardModal')?.classList.add('hidden');
}

function updateCardPreview() {
    const preview = document.getElementById('cardPreview');
    const text = document.getElementById('newCardText')?.value || '새 카드';
    
    preview.innerHTML = `
        <div class="preview-icon"><i data-lucide="${selectedIconForNewCard}"></i></div>
        <span class="preview-text">${text}</span>
    `;
    lucide.createIcons();
}

function confirmAddCard() {
    const text = document.getElementById('newCardText')?.value.trim();
    
    if (!text) {
        alert('카드 텍스트를 입력해주세요');
        return;
    }
    
    const existing = getCardData(addingToCategory);
    if (existing.some(c => c.text === text)) {
        alert('이미 같은 이름의 카드가 있습니다');
        return;
    }
    
    if (!State.userCards[addingToCategory]) {
        State.userCards[addingToCategory] = [];
    }
    
    State.userCards[addingToCategory].push({
        icon: selectedIconForNewCard,
        text: text
    });
    
    saveUserCards();
    closeAddCardModal();
    renderCards(addingToCategory);
    
    alert(`"${text}" 카드가 추가되었습니다`);
}

// ========================================
// 확인 모달 (커스텀 confirm)
// ========================================
let confirmResolve = null;

function showConfirmModal(message) {
    return new Promise((resolve) => {
        confirmResolve = resolve;
        
        const modal = document.getElementById('confirmModal');
        const messageEl = document.getElementById('confirmMessage');
        
        if (!modal || !messageEl) {
            resolve(confirm(message));
            return;
        }
        
        messageEl.textContent = message;
        modal.classList.remove('hidden');
        
        lucide.createIcons();
    });
}

function closeConfirmModal(result) {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    
    if (confirmResolve) {
        confirmResolve(result);
        confirmResolve = null;
    }
}

// ========================================
// 폰트 크기 적용
// ========================================
function applyFontSize(size) {
    const sizeMap = {
        'small': '14px',
        'medium': '18px',
        'large': '24px'
    };
    
    const rootSize = sizeMap[size] || '18px';
    document.documentElement.style.setProperty('--base-font-size', rootSize);
    
    const cardSizeMap = {
        'small': '0.8rem',
        'medium': '1rem',
        'large': '1.3rem'
    };
    document.documentElement.style.setProperty('--card-text-size', cardSizeMap[size] || '1rem');
    
    const tabSizeMap = {
        'small': '0.7rem',
        'medium': '0.85rem',
        'large': '1.1rem'
    };
    document.documentElement.style.setProperty('--tab-text-size', tabSizeMap[size] || '0.85rem');
    
    const menuSizeMap = {
        'small': '0.85rem',
        'medium': '1rem',
        'large': '1.3rem'
    };
    document.documentElement.style.setProperty('--menu-text-size', menuSizeMap[size] || '1rem');
}