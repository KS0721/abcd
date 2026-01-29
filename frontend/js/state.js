// ========================================
// state.js - 전역 상태, 선택 관리, 로컬 스토리지
// ========================================
console.log('📊 state.js 로드됨');

// ========================================
// 전역 상태
// ========================================
const State = {
    currentSlide: 0,
    currentCategory: 'action',
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
    place: [],
    person: [],
    food: [],
    need: [],
    predicate: null
};

// ========================================
// 선택 초기화
// ========================================
function clearSelection() {
    Selection.time = null;
    Selection.place = [];
    Selection.person = [];
    Selection.food = [];
    Selection.need = [];
    Selection.predicate = null;
    State.showSuggestions = false;
    State.currentPredicate = null;
    hideSuggestionTab();
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
        
        // 다크모드
        if (s.darkMode) document.body.classList.add('dark-mode');
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) darkModeToggle.checked = s.darkMode || false;
        
        // 폰트 크기
        if (s.fontSize) {
            document.body.classList.add(`font-${s.fontSize}`);
            const fontSizeSelect = document.getElementById('fontSize');
            if (fontSizeSelect) fontSizeSelect.value = s.fontSize;
            applyFontSize(s.fontSize);
        }
        
        // 진동 설정 (기본값: true)
        const vibrationToggle = document.getElementById('vibrationToggle');
        if (vibrationToggle) {
            // vibration이 명시적으로 false가 아니면 true (기본값 ON)
            vibrationToggle.checked = s.vibration !== false;
        }
    } else {
        // 설정이 없으면 진동 기본값 ON
        const vibrationToggle = document.getElementById('vibrationToggle');
        if (vibrationToggle) vibrationToggle.checked = true;
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
        darkMode: document.body.classList.contains('dark-mode'),
        fontSize: document.getElementById('fontSize')?.value || 'medium',
        vibration: document.getElementById('vibrationToggle')?.checked !== false
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
        type: item.type 
    };
    
    // need 카테고리
    if (category === 'need') {
        const index = Selection.need.findIndex(i => i.text === item.text);
        if (index >= 0) {
            Selection.need.splice(index, 1);
        } else {
            Selection.need.push(card);
        }
        Selection.predicate = null;
        Selection.time = null;
        Selection.place = [];
        Selection.person = [];
        Selection.food = [];
        hideSuggestionTab();
        updateOutputBar();
        return;
    }
    
    if (Selection.need.length > 0) {
        Selection.need = [];
    }
    
    // 서술어 카테고리
    if (PREDICATE_CATEGORIES.includes(category)) {
        if (Selection.predicate && Selection.predicate.text === item.text && Selection.predicate.category === category) {
            Selection.predicate = null;
            hideSuggestionTab();
        } else {
            Selection.predicate = card;
            showSuggestionTab(item.text);
        }
    } 
    else if (category === 'time') {
        if (Selection.time && Selection.time.text === item.text) {
            Selection.time = null;
        } else {
            Selection.time = card;
        }
    }
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
// 커스텀 카드 삭제 (커스텀 모달 사용)
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
        category: 'pain'
    };
    updateOutputBar();
}

// ========================================
// 검색용 전체 단어 가져오기
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