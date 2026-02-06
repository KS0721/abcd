// ========================================
// state.js - 전역 상태, 선택 관리, 로컬 스토리지
// ========================================
console.log('📊 state.js 로드됨');

// ========================================
// 전역 상태
// ========================================
const State = {
    currentSlide: 0,
    currentCategory: 'core',  // 기본값: 핵심어휘
    currentMessage: '',
    currentIcon: 'message-circle',
    selectedPainPart: null,
    selectedPainLevel: null,
    userCards: {},
    sentenceHistory: [],
    showSuggestions: false,
    currentPredicate: null
};

const Selection = {
    time: null,
    person: [],
    need: null,
    predicate: null
};

// ========================================
// 선택 초기화
// ========================================
function clearSelection() {
    Selection.time = null;
    Selection.person = [];
    Selection.need = null;
    Selection.predicate = null;
    State.showSuggestions = false;
    State.currentPredicate = null;
    State.selectedPainPart = null;
    State.selectedPainLevel = null;
    
    document.querySelectorAll('.pain-btn').forEach(b => b.classList.remove('selected'));
}

// ========================================
// 로컬 스토리지
// ========================================
function loadLocalData() {
    const history = localStorage.getItem('aac_history');
    if (history) State.sentenceHistory = JSON.parse(history);
    
    const cards = localStorage.getItem('aac_userCards');
    if (cards) State.userCards = JSON.parse(cards);
    
    const settings = localStorage.getItem('aac_settings');
    if (settings) {
        const s = JSON.parse(settings);
        
        // 고대비 모드 (다크모드 통합)
        if (s.highContrast) {
            document.body.classList.add('high-contrast');
            document.body.classList.add('dark-mode');
            const toggle = document.getElementById('highContrastToggle');
            if (toggle) toggle.checked = true;
        }
        
        // 폰트 크기
        if (s.fontSize) {
            document.body.classList.add(`font-${s.fontSize}`);
            const select = document.getElementById('fontSize');
            if (select) select.value = s.fontSize;
            applyFontSize(s.fontSize);
        }
        
        // 진동
        const vibToggle = document.getElementById('vibrationToggle');
        if (vibToggle) vibToggle.checked = s.vibration !== false;
        
        // 롱프레스 시간
        if (s.longPressTime) {
            const select = document.getElementById('longPressTime');
            if (select) select.value = s.longPressTime;
        }
    } else {
        const vibToggle = document.getElementById('vibrationToggle');
        if (vibToggle) vibToggle.checked = true;
    }
}

function saveHistory() {
    localStorage.setItem('aac_history', JSON.stringify(State.sentenceHistory));
}

function saveUserCards() {
    localStorage.setItem('aac_userCards', JSON.stringify(State.userCards));
}

function saveSettings() {
    const settings = {
        highContrast: document.body.classList.contains('high-contrast'),
        darkMode: document.body.classList.contains('dark-mode'),
        fontSize: document.getElementById('fontSize')?.value || 'medium',
        vibration: document.getElementById('vibrationToggle')?.checked !== false,
        longPressTime: document.getElementById('longPressTime')?.value || '500'
    };
    localStorage.setItem('aac_settings', JSON.stringify(settings));
}

function addToHistory(sentence) {
    if (!sentence || State.sentenceHistory.includes(sentence)) return;
    State.sentenceHistory.unshift(sentence);
    if (State.sentenceHistory.length > 50) State.sentenceHistory.pop();
    saveHistory();
}

// ========================================
// 카드 데이터 헬퍼
// ========================================
function getCardData(category) {
    const defaultCards = defaultCardData[category] || [];
    const userAdded = State.userCards[category] || [];
    return [...defaultCards, ...userAdded];
}

// ========================================
// 카드 선택 처리
// ========================================
function handleCardSelect(category, item, displayText) {
    const card = { 
        text: item.text, 
        icon: item.icon, 
        displayText: displayText, 
        category: category, 
        type: item.type,
        originalText: item.originalText || item.text
    };
    
    // 서술어 카테고리 (core, action, feeling, pain) - 단일 선택, 토글
    if (PREDICATE_CATEGORIES.includes(category)) {
        const compareText = item.originalText || item.text;
        
        if (Selection.predicate && 
            (Selection.predicate.originalText || Selection.predicate.text) === compareText && 
            Selection.predicate.category === category) {
            Selection.predicate = null;
            State.selectedPainPart = null;
            State.selectedPainLevel = null;
            document.querySelectorAll('.pain-btn').forEach(b => b.classList.remove('selected'));
        } else {
            Selection.predicate = card;
            
            if (category === 'pain') {
                State.selectedPainPart = {
                    text: item.originalText || item.text,
                    display: displayText,
                    icon: item.icon
                };
            }
        }
    }
    // need - 단일 선택, 토글
    else if (category === 'need') {
        if (Selection.need && Selection.need.text === item.text) {
            Selection.need = null;
        } else {
            Selection.need = card;
        }
    }
    // 시간 - 단일 선택, 토글
    else if (category === 'time') {
        if (Selection.time && Selection.time.text === item.text) {
            Selection.time = null;
        } else {
            Selection.time = card;
        }
    }
    // 다중 선택 (place, person, food) - 토글
    else if (CATEGORY_RULES.multiple.includes(category)) {
        const list = Selection[category];
        const index = list.findIndex(i => i.text === item.text);
        if (index >= 0) {
            list.splice(index, 1);
        } else {
            list.push(card);
        }
    }
    
    updateOutputBar();
}

// ========================================
// 커스텀 카드 삭제
// ========================================
async function deleteUserCard(category, text) {
    const confirmed = await showConfirmModal(`"${text}" 카드를 삭제할까요?`);
    if (!confirmed) return;
    
    if (State.userCards[category]) {
        State.userCards[category] = State.userCards[category].filter(c => c.text !== text);
        saveUserCards();
        renderCards(category);
    }
}

// ========================================
// 통증 메시지 업데이트
// ========================================
function updatePainMessage() {
    if (!State.selectedPainPart) return;
    
    let message = State.selectedPainPart.display;
    
    if (State.selectedPainLevel) {
        message += ` (${State.selectedPainLevel}단계)`;
        if (State.selectedPainLevel >= 7) message += ' - 많이 아파요!';
        else if (State.selectedPainLevel >= 4) message += ' - 아파요';
        else message += ' - 조금 아파요';
    }
    
    Selection.predicate = { 
        text: message, 
        icon: State.selectedPainPart.icon,
        displayText: message,
        category: 'pain',
        originalText: State.selectedPainPart.text
    };
    updateOutputBar();
}

// ========================================
// 검색용 전체 단어
// ========================================
function getAllWords() {
    const words = [];
    Object.keys(defaultCardData).forEach(category => {
        getCardData(category).forEach(item => {
            let text = item.text;
            if (category === 'pain' && !['어지러움', '토할 것 같음', '추움', '열남'].includes(text)) {
                text += ' 아파요';
            }
            words.push({ ...item, text, category });
        });
    });
    return words;
}