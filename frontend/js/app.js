// ========================================
// 데이터 - data.js
// ========================================
console.log('📦 data.js 로드됨');

// 아이콘 목록
const availableIcons = [
    "heart", "star", "smile", "frown", "meh", "angry",
    "thumbs-up", "thumbs-down", "hand", "home", "car", "bus",
    "phone", "mail", "camera", "music", "book", "pen",
    "clock", "calendar", "sun", "moon", "cloud", "umbrella",
    "coffee", "pizza", "apple", "cake", "cookie", "candy",
    "shirt", "glasses", "watch", "key", "lock", "gift",
    "flag", "map", "compass", "globe", "tree", "flower",
    "dog", "cat", "bird", "fish", "paw-print",
    "baby", "user", "users", "accessibility", "eye", "ear",
    "brain", "activity", "pill", "stethoscope", "thermometer", "bandage",
    "bed", "bath", "door-open", "lamp", "tv",
    "wifi", "battery", "zap", "flame", "snowflake", "droplet",
    "wind", "volume-2", "bell", "alarm-clock", "hourglass",
    "check", "x", "plus", "minus", "help-circle", "info",
    "alert-circle", "alert-triangle", "shield", "award"
];

// 시제/존댓말 변환
const verbConjugations = {
    "가요": { past: "갔어요", future: "갈 거예요", casual: "가", formal: "갑니다" },
    "와요": { past: "왔어요", future: "올 거예요", casual: "와", formal: "옵니다" },
    "먹어요": { past: "먹었어요", future: "먹을 거예요", casual: "먹어", formal: "먹습니다" },
    "마셔요": { past: "마셨어요", future: "마실 거예요", casual: "마셔", formal: "마십니다" },
    "화장실 가요": { past: "화장실 갔어요", future: "화장실 갈 거예요", casual: "화장실 가", formal: "화장실 갑니다" },
    "자요": { past: "잤어요", future: "잘 거예요", casual: "자", formal: "잡니다" },
    "멈춰요": { past: "멈췄어요", future: "멈출 거예요", casual: "멈춰", formal: "멈춥니다" },
    "기다려요": { past: "기다렸어요", future: "기다릴 거예요", casual: "기다려", formal: "기다립니다" },
    "봐요": { past: "봤어요", future: "볼 거예요", casual: "봐", formal: "봅니다" },
    "들어요": { past: "들었어요", future: "들을 거예요", casual: "들어", formal: "듣습니다" },
    "써요": { past: "썼어요", future: "쓸 거예요", casual: "써", formal: "씁니다" },
    "전화해요": { past: "전화했어요", future: "전화할 거예요", casual: "전화해", formal: "전화합니다" },
    "좋아요": { past: "좋았어요", future: "좋을 거예요", casual: "좋아", formal: "좋습니다" },
    "슬퍼요": { past: "슬펐어요", future: "슬플 거예요", casual: "슬퍼", formal: "슬픕니다" },
    "화나요": { past: "화났어요", future: "화날 거예요", casual: "화나", formal: "화납니다" },
    "무서워요": { past: "무서웠어요", future: "무서울 거예요", casual: "무서워", formal: "무섭습니다" },
    "피곤해요": { past: "피곤했어요", future: "피곤할 거예요", casual: "피곤해", formal: "피곤합니다" },
    "행복해요": { past: "행복했어요", future: "행복할 거예요", casual: "행복해", formal: "행복합니다" },
    "도와주세요": { past: "도와줬어요", future: "도와줄 거예요", casual: "도와줘", formal: "도와주십시오" },
    "머리 아파요": { past: "머리 아팠어요", future: "머리 아플 거예요", casual: "머리 아파", formal: "머리 아픕니다" },
    "배 아파요": { past: "배 아팠어요", future: "배 아플 거예요", casual: "배 아파", formal: "배 아픕니다" },
    "어지러워요": { past: "어지러웠어요", future: "어지러울 거예요", casual: "어지러워", formal: "어지럽습니다" },
    "추워요": { past: "추웠어요", future: "추울 거예요", casual: "추워", formal: "춥습니다" }
};

// 기본 카드 데이터
const defaultCardData = {
    action: [
        { icon: "footprints", text: "가요" },
        { icon: "home", text: "와요" },
        { icon: "utensils", text: "먹어요" },
        { icon: "cup-soda", text: "마셔요" },
        { icon: "door-open", text: "화장실 가요" },
        { icon: "moon", text: "자요" },
        { icon: "square", text: "멈춰요" },
        { icon: "clock", text: "기다려요" },
        { icon: "eye", text: "봐요" },
        { icon: "ear", text: "들어요" },
        { icon: "pencil", text: "써요" },
        { icon: "phone", text: "전화해요" }
    ],
    feeling: [
        { icon: "smile", text: "좋아요" },
        { icon: "frown", text: "슬퍼요" },
        { icon: "angry", text: "화나요" },
        { icon: "alert-circle", text: "무서워요" },
        { icon: "battery-low", text: "피곤해요" },
        { icon: "cloud", text: "답답해요" },
        { icon: "heart", text: "행복해요" },
        { icon: "cloud-rain", text: "우울해요" },
        { icon: "zap", text: "놀랐어요" },
        { icon: "meh", text: "그냥 그래요" },
        { icon: "thumbs-up", text: "기분 좋아요" },
        { icon: "thumbs-down", text: "기분 나빠요" }
    ],
    need: [
        { icon: "life-buoy", text: "도와주세요" },
        { icon: "pill", text: "약 주세요" },
        { icon: "droplet", text: "물 주세요" },
        { icon: "utensils", text: "밥 주세요" },
        { icon: "phone", text: "전화해주세요" },
        { icon: "stethoscope", text: "의사 불러주세요" },
        { icon: "volume-x", text: "조용히 해주세요" },
        { icon: "repeat", text: "다시 말해주세요" },
        { icon: "shirt", text: "옷 갈아입을래요" },
        { icon: "wind", text: "환기해주세요" },
        { icon: "sun", text: "불 켜주세요" },
        { icon: "moon", text: "불 꺼주세요" }
    ],
    pain: [
        { icon: "brain", text: "머리" },
        { icon: "heart", text: "가슴" },
        { icon: "circle", text: "배" },
        { icon: "arrow-down", text: "다리" },
        { icon: "hand", text: "팔" },
        { icon: "rotate-ccw", text: "어지러움" },
        { icon: "frown", text: "토할 것 같음" },
        { icon: "snowflake", text: "추움" },
        { icon: "flame", text: "열남" },
        { icon: "eye", text: "눈" },
        { icon: "ear", text: "귀" },
        { icon: "smile", text: "이/잇몸" }
    ],
    place: [
        { icon: "home", text: "집" },
        { icon: "building", text: "병원" },
        { icon: "graduation-cap", text: "학교" },
        { icon: "door-open", text: "화장실" },
        { icon: "bed", text: "침실" },
        { icon: "sofa", text: "거실" },
        { icon: "utensils", text: "식당" },
        { icon: "shopping-cart", text: "마트" },
        { icon: "tree", text: "공원" },
        { icon: "briefcase", text: "회사" },
        { icon: "church", text: "종교시설" },
        { icon: "car", text: "차 안" }
    ],
    person: [
        { icon: "user", text: "나" },
        { icon: "heart", text: "엄마" },
        { icon: "shield", text: "아빠" },
        { icon: "users", text: "가족" },
        { icon: "graduation-cap", text: "선생님" },
        { icon: "stethoscope", text: "의사" },
        { icon: "plus-circle", text: "간호사" },
        { icon: "smile", text: "친구" },
        { icon: "baby", text: "아이" },
        { icon: "glasses", text: "할머니" },
        { icon: "glasses", text: "할아버지" },
        { icon: "briefcase", text: "직장동료" }
    ],
    food: [
        { icon: "beef", text: "고기" },
        { icon: "salad", text: "야채" },
        { icon: "apple", text: "과일" },
        { icon: "sandwich", text: "빵" },
        { icon: "soup", text: "국/찌개" },
        { icon: "wheat", text: "밥" },
        { icon: "egg", text: "계란" },
        { icon: "fish", text: "생선" },
        { icon: "milk", text: "우유" },
        { icon: "coffee", text: "커피" },
        { icon: "cup-soda", text: "음료수" },
        { icon: "cookie", text: "과자" }
    ],
    time: [
        { icon: "sunrise", text: "아침" },
        { icon: "sun", text: "점심" },
        { icon: "sunset", text: "저녁" },
        { icon: "moon", text: "밤" },
        { icon: "clock", text: "지금" },
        { icon: "clock-1", text: "나중에" },
        { icon: "calendar", text: "오늘" },
        { icon: "calendar-plus", text: "내일" },
        { icon: "calendar-minus", text: "어제" },
        { icon: "timer", text: "잠깐만" },
        { icon: "hourglass", text: "곧" },
        { icon: "infinity", text: "항상" }
    ]
};

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
    isListening: false
};

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

document.querySelectorAll('.tab-bar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        goToSlide(parseInt(btn.dataset.slide));
    });
});

// 스와이프
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.slide-container')?.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.querySelector('.slide-container')?.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 50;
    
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
        if (s.darkMode) document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = s.darkMode || false;
        
        if (s.fontSize) {
            document.body.classList.add(`font-${s.fontSize}`);
            document.getElementById('fontSize').value = s.fontSize;
        }
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
        fontSize: document.getElementById('fontSize').value
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
// 출력 바
// ========================================
function selectMessage(text, icon) {
    State.currentMessage = text;
    State.currentIcon = icon;
    State.selectedPainPart = null;
    State.selectedPainLevel = null;
    updateOutputBar();
}

function updateOutputBar() {
    const outputText = document.getElementById('outputText');
    const speakBtn = document.getElementById('speakBtn');
    const showBtn = document.getElementById('showBtn');
    const clearBtn = document.getElementById('clearBtn');
    
    if (State.currentMessage) {
        outputText.innerHTML = State.currentMessage;
        outputText.classList.add('has-message');
        speakBtn.disabled = false;
        showBtn.disabled = false;
        clearBtn.disabled = false;
    } else {
        outputText.innerHTML = '<span class="placeholder">카드를 선택하세요</span>';
        outputText.classList.remove('has-message');
        speakBtn.disabled = true;
        showBtn.disabled = true;
        clearBtn.disabled = true;
    }
}

document.getElementById('speakBtn')?.addEventListener('click', () => {
    if (State.currentMessage) {
        speak(State.currentMessage);
        addToHistory(State.currentMessage);
    }
});

document.getElementById('showBtn')?.addEventListener('click', () => {
    if (State.currentMessage) {
        showListenerModal(State.currentMessage, State.currentIcon);
        speak(State.currentMessage);
        addToHistory(State.currentMessage);
    }
});

document.getElementById('clearBtn')?.addEventListener('click', () => {
    State.currentMessage = '';
    State.currentIcon = 'message-circle';
    State.selectedPainPart = null;
    State.selectedPainLevel = null;
    
    document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.pain-btn').forEach(b => b.classList.remove('selected'));
    updateOutputBar();
});

// ========================================
// 카드 데이터 헬퍼
// ========================================
function getCardData(category) {
    const defaultCards = defaultCardData[category] || [];
    const userAdded = State.userCards[category] || [];
    return [...defaultCards, ...userAdded];
}

// ========================================
// 말하기 탭 - 카드 렌더링
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
        card.innerHTML = `
            <div class="card-icon"><i data-lucide="${item.icon}"></i></div>
            <div class="card-text">${displayText}</div>
            <button class="ai-btn" title="AI 추천"><i data-lucide="sparkles"></i></button>
            ${isUserCard ? `<button class="delete-btn" title="삭제"><i data-lucide="x"></i></button>` : ''}
        `;
        
        card.addEventListener('click', (e) => {
            if (e.target.closest('.ai-btn') || e.target.closest('.delete-btn')) return;
            
            document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            if (category === 'pain') {
                State.selectedPainPart = { icon: item.icon, text: item.text, display: displayText };
                updatePainMessage();
            } else {
                selectMessage(displayText, item.icon);
            }
        });
        
        card.querySelector('.ai-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            showAISuggestions(displayText, category);
        });
        
        if (isUserCard) {
            card.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteUserCard(category, item.text);
            });
        }
        
        setupLongPress(card, displayText, item.icon);
        
        container.appendChild(card);
    });
    
    const addBtn = document.createElement('div');
    addBtn.className = 'add-card-btn';
    addBtn.innerHTML = `<i data-lucide="plus"></i><span>추가</span>`;
    addBtn.addEventListener('click', () => openAddCardModal(category));
    container.appendChild(addBtn);
    
    const painScale = document.getElementById('painScale');
    if (painScale) painScale.classList.toggle('hidden', category !== 'pain');
    
    lucide.createIcons();
}

// 카테고리 탭 이벤트
document.querySelectorAll('.category-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCards(btn.dataset.category);
    });
});

// ========================================
// 통증 기능
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
    
    State.currentMessage = message;
    State.currentIcon = State.selectedPainPart.icon;
    updateOutputBar();
}

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
            document.querySelectorAll('.pain-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            State.selectedPainLevel = i;
            updatePainMessage();
        });
        
        container.appendChild(btn);
    }
}

// ========================================
// 긴급 버튼
// ========================================
document.querySelectorAll('.emergency-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const text = btn.dataset.text;
        const icon = btn.dataset.icon || 'alert-triangle';
        selectMessage(text, icon);
        speak(text);
        showListenerModal(text, icon);
        addToHistory(text);
    });
});

// ========================================
// AI 추천
// ========================================
function showAISuggestions(word, category) {
    const panel = document.getElementById('aiSuggestPanel');
    const wordEl = document.getElementById('aiSuggestWord');
    const container = document.getElementById('aiSuggestions');
    
    if (!panel) return;
    
    wordEl.textContent = word;
    panel.classList.remove('hidden');
    container.innerHTML = '<div class="loading"><div class="spinner"></div><span>AI 추천 중...</span></div>';
    
    const suggestions = getDummySuggestions(word);
    
    setTimeout(() => {
        if (suggestions.length > 0) {
            container.innerHTML = suggestions.map(phrase => 
                `<button class="ai-suggest-btn" data-phrase="${phrase}">${phrase}</button>`
            ).join('');
            
            container.querySelectorAll('.ai-suggest-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const fullMessage = `${word} ${btn.dataset.phrase}`;
                    selectMessage(fullMessage, 'sparkles');
                    closeAISuggestPanel();
                });
            });
        } else {
            container.innerHTML = '<p class="empty-message">추천 없음</p>';
        }
        lucide.createIcons();
    }, 300);
}

function getDummySuggestions(word) {
    const suggestions = {
        '물': ['주세요', '마시고 싶어요', '차가운 걸로요', '괜찮아요', '더 주세요'],
        '밥': ['주세요', '먹고 싶어요', '배불러요', '맛있어요'],
        '가요': ['집에', '병원에', '화장실에', '지금'],
        '좋아요': ['정말', '너무', '아주', '많이'],
        '아파요': ['많이', '조금', '여기가', '계속'],
        '도와주세요': ['빨리', '제발', '지금'],
    };
    return suggestions[word] || ['주세요', '싶어요', '괜찮아요', '아니에요', '네'];
}

function closeAISuggestPanel() {
    document.getElementById('aiSuggestPanel')?.classList.add('hidden');
}

document.getElementById('closeSuggestPanel')?.addEventListener('click', closeAISuggestPanel);

// ========================================
// 롱프레스 메뉴
// ========================================
let longPressTimer = null;

function setupLongPress(card, text, icon) {
    const startPress = (e) => {
        if (e.target.closest('.ai-btn') || e.target.closest('.delete-btn')) return;
        
        longPressTimer = setTimeout(() => {
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
            <div class="longpress-menu-item selected" data-text="${text}">${text} <span class="tag">현재</span></div>
            <div class="longpress-menu-item" data-text="${conjugation.past}">${conjugation.past} <span class="tag">과거</span></div>
            <div class="longpress-menu-item" data-text="${conjugation.future}">${conjugation.future} <span class="tag">미래</span></div>
        </div>
        <div class="longpress-menu-section">
            <div class="longpress-menu-label">존댓말</div>
            <div class="longpress-menu-item" data-text="${conjugation.casual}">${conjugation.casual} <span class="tag">반말</span></div>
            <div class="longpress-menu-item" data-text="${conjugation.formal}">${conjugation.formal} <span class="tag">높임</span></div>
        </div>
    `;
    
    const rect = e.target.closest('.card').getBoundingClientRect();
    menu.style.left = `${Math.min(rect.left, window.innerWidth - 200)}px`;
    menu.style.top = `${Math.max(rect.top - 200, 10)}px`;
    
    menu.querySelectorAll('.longpress-menu-item').forEach(item => {
        item.addEventListener('click', () => {
            selectMessage(item.dataset.text, icon);
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
// 커스텀 카드 삭제
// ========================================
function deleteUserCard(category, text) {
    if (!confirm(`"${text}" 카드를 삭제할까요?`)) return;
    
    if (State.userCards[category]) {
        State.userCards[category] = State.userCards[category].filter(c => c.text !== text);
        saveUserCards();
        renderCards(category);
    }
}

// ========================================
// 기록 탭
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
            const text = item.dataset.text;
            selectMessage(text, 'history');
            speak(text);
            goToSlide(0);
        });
    });
    
    lucide.createIcons();
}

document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
    if (State.sentenceHistory.length === 0) {
        alert('삭제할 기록이 없습니다');
        return;
    }
    
    if (confirm('모든 기록을 삭제할까요?')) {
        State.sentenceHistory = [];
        saveHistory();
        renderHistory();
    }
});

// ========================================
// 검색 탭
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

document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    const results = document.getElementById('searchResults');
    
    if (!query) {
        results.innerHTML = '';
        return;
    }
    
    const allWords = getAllWords();
    const wordMatches = allWords.filter(w => w.text.toLowerCase().includes(query));
    const historyMatches = State.sentenceHistory.filter(s => s.toLowerCase().includes(query));
    
    let html = '';
    
    if (historyMatches.length > 0) {
        html += '<p class="search-section-title">📝 기록</p>';
        html += historyMatches.slice(0, 5).map(s => `
            <div class="search-result-item" data-text="${s}" data-icon="history">
                <div class="icon"><i data-lucide="history"></i></div>
                <div class="text">${s}</div>
            </div>
        `).join('');
    }
    
    if (wordMatches.length > 0) {
        html += '<p class="search-section-title">💬 단어</p>';
        html += wordMatches.slice(0, 10).map(w => `
            <div class="search-result-item" data-text="${w.text}" data-icon="${w.icon}">
                <div class="icon"><i data-lucide="${w.icon}"></i></div>
                <div class="text">${w.text}</div>
            </div>
        `).join('');
    }
    
    if (!html) {
        html = '<p class="empty-message">검색 결과 없음</p>';
    }
    
    results.innerHTML = html;
    lucide.createIcons();
    
    results.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            selectMessage(item.dataset.text, item.dataset.icon);
            speak(item.dataset.text);
            goToSlide(0);
        });
    });
});

// ========================================
// 설정 탭
// ========================================
document.getElementById('darkModeToggle')?.addEventListener('change', (e) => {
    document.body.classList.toggle('dark-mode', e.target.checked);
    saveSettings();
});

document.getElementById('fontSize')?.addEventListener('change', (e) => {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add(`font-${e.target.value}`);
    saveSettings();
});

// ========================================
// 모달 - 청자 모드
// ========================================
function showListenerModal(text, icon) {
    const modal = document.getElementById('listenerModal');
    const iconEl = document.getElementById('listenerIcon');
    const textEl = document.getElementById('listenerText');
    
    iconEl.innerHTML = `<i data-lucide="${icon}"></i>`;
    textEl.textContent = text;
    modal.classList.remove('hidden');
    
    lucide.createIcons();
}

document.getElementById('closeListenerModal')?.addEventListener('click', () => {
    document.getElementById('listenerModal')?.classList.add('hidden');
});

// ========================================
// 모달 - 음성 인식
// ========================================
document.getElementById('listenBtn')?.addEventListener('click', startListening);

async function startListening() {
    const btn = document.getElementById('listenBtn');
    const modal = document.getElementById('listenResultModal');
    const heardText = document.getElementById('heardText');
    const responses = document.getElementById('aiResponses');
    
    if (State.isListening) return;
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('이 브라우저에서는 음성 인식을 지원하지 않습니다.');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    try {
        State.isListening = true;
        btn.classList.add('listening');
        
        recognition.start();
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            
            heardText.textContent = transcript;
            modal.classList.remove('hidden');
            responses.innerHTML = '<div class="loading"><div class="spinner"></div><span>AI 추천 중...</span></div>';
            
            const dummyResponses = getDummyResponses(transcript);
            
            setTimeout(() => {
                responses.innerHTML = dummyResponses.map(r => 
                    `<button class="ai-response-btn" data-response="${r}">${r}</button>`
                ).join('');
                
                responses.querySelectorAll('.ai-response-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        selectMessage(btn.dataset.response, 'message-circle');
                        speak(btn.dataset.response);
                        addToHistory(btn.dataset.response);
                        closeListenModal();
                    });
                });
                
                lucide.createIcons();
            }, 300);
            
            State.isListening = false;
            btn.classList.remove('listening');
        };
        
        recognition.onerror = (event) => {
            console.error('음성 인식 오류:', event.error);
            alert('음성 인식에 실패했습니다. 다시 시도해주세요.');
            State.isListening = false;
            btn.classList.remove('listening');
        };
        
        recognition.onend = () => {
            State.isListening = false;
            btn.classList.remove('listening');
        };
        
    } catch (error) {
        alert('음성 인식 실패: ' + error.message);
        State.isListening = false;
        btn.classList.remove('listening');
    }
}

function getDummyResponses(heardText) {
    if (heardText.includes('먹') || heardText.includes('밥')) {
        return ['네, 먹었어요', '아니요, 아직이요', '배고파요', '괜찮아요', '나중에 먹을래요'];
    }
    if (heardText.includes('아프') || heardText.includes('아파')) {
        return ['네, 아파요', '아니요, 괜찮아요', '조금 아파요', '많이 아파요', '여기가 아파요'];
    }
    if (heardText.includes('괜찮')) {
        return ['네, 괜찮아요', '아니요', '조금 힘들어요', '도와주세요'];
    }
    return ['네', '아니요', '괜찮아요', '잘 모르겠어요', '다시 말해주세요'];
}

function closeListenModal() {
    document.getElementById('listenResultModal')?.classList.add('hidden');
}

document.getElementById('closeListenModal')?.addEventListener('click', closeListenModal);

// ========================================
// 모달 - 카드 추가
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
    document.getElementById('imagePreview')?.classList.add('hidden');
    document.getElementById('cardImageInput').value = '';
    
    iconSelector.innerHTML = availableIcons.map(icon => `
        <div class="icon-option ${icon === selectedIconForNewCard ? 'selected' : ''}" data-icon="${icon}">
            <i data-lucide="${icon}"></i>
        </div>
    `).join('');
    
    iconSelector.querySelectorAll('.icon-option').forEach(opt => {
        opt.addEventListener('click', () => {
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
        <div class="card-icon"><i data-lucide="${selectedIconForNewCard}"></i></div>
        <div class="card-text">${text}</div>
    `;
    lucide.createIcons();
}

document.getElementById('newCardText')?.addEventListener('input', updateCardPreview);
document.getElementById('closeAddCardModal')?.addEventListener('click', closeAddCardModal);
document.getElementById('cancelAddCard')?.addEventListener('click', closeAddCardModal);

document.getElementById('confirmAddCard')?.addEventListener('click', () => {
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
});

document.getElementById('uploadImageBtn')?.addEventListener('click', () => {
    document.getElementById('cardImageInput')?.click();
});

document.getElementById('cardImageInput')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const preview = document.getElementById('imagePreview');
    const img = document.getElementById('previewImg');
    
    const reader = new FileReader();
    reader.onload = (ev) => {
        img.src = ev.target.result;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
    
    lucide.createIcons();
});

document.getElementById('removeImageBtn')?.addEventListener('click', () => {
    document.getElementById('imagePreview')?.classList.add('hidden');
    document.getElementById('cardImageInput').value = '';
});

// ========================================
// 초기화
// ========================================
function init() {
    console.log('🔄 초기화 시작...');
    
    loadLocalData();
    renderCards('action');
    createPainButtons();
    updateOutputBar();
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        console.log('✅ Lucide 아이콘 생성 완료');
    } else {
        console.error('❌ Lucide 로드 안됨');
    }
    
    console.log('✅ AAC 앱 초기화 완료');
}

window.onload = function() {
    init();
};
