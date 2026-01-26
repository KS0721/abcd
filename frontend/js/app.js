// ========================================
// app.js - 초기화, 이벤트 연결
// ========================================
console.log('🚀 app.js 로드됨');

// ========================================
// 터치/스와이프 변수
// ========================================
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let isSwipingInCategoryTabs = false;

// ========================================
// 이벤트 리스너 설정
// ========================================
function setupEventListeners() {
    
    // 하단 탭 바
    document.querySelectorAll('.tab-bar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            goToSlide(parseInt(btn.dataset.slide));
        });
    });
    
    // 카테고리 탭
    document.querySelectorAll('.category-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.category-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCards(btn.dataset.category);
        });
    });
    
    // 스와이프 제스처
    document.querySelector('.slide-container')?.addEventListener('touchstart', e => {
        const target = e.target;
        const categoryTabs = target.closest('.category-tabs');
        
        isSwipingInCategoryTabs = categoryTabs !== null;
        
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.querySelector('.slide-container')?.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        
        if (!isSwipingInCategoryTabs) {
            handleSwipe();
        }
        isSwipingInCategoryTabs = false;
    }, { passive: true });
    
    // 출력 바 버튼들
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
        clearSelection();
        State.currentMessage = '';
        State.currentIcon = 'message-circle';
        State.selectedPainPart = null;
        State.selectedPainLevel = null;
        updateOutputBar();
    });
    
    // 긴급 버튼
    document.querySelectorAll('.emergency-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            const icon = btn.dataset.icon || 'alert-triangle';
            
            clearSelection();
            Selection.predicate = { text, icon, displayText: text, category: 'emergency' };
            updateOutputBar();
            speak(text);
            showListenerModal(text, icon);
            addToHistory(text);
        });
    });
    
    // 청자 모달 닫기
    document.getElementById('closeListenerModal')?.addEventListener('click', closeListenerModal);
    
    // 음성 인식
    document.getElementById('listenBtn')?.addEventListener('click', startListening);
    document.getElementById('closeListenModal')?.addEventListener('click', closeListenModal);
    
    // 기록 삭제 (커스텀 모달 사용)
    document.getElementById('clearHistoryBtn')?.addEventListener('click', async () => {
        if (State.sentenceHistory.length === 0) {
            alert('삭제할 기록이 없습니다');
            return;
        }
        
        const confirmed = await showConfirmModal('모든 기록을 삭제할까요?');
        if (confirmed) {
            State.sentenceHistory = [];
            saveHistory();
            renderHistory();
        }
    });
    
    // 검색
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
                <div class="search-result-item" data-text="${w.text}" data-icon="${w.icon}" data-category="${w.category}">
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
                const text = item.dataset.text;
                const icon = item.dataset.icon;
                const category = item.dataset.category;
                
                if (category) {
                    handleCardSelect(category, { text, icon }, text);
                } else {
                    clearSelection();
                    Selection.predicate = { text, icon, displayText: text, category: 'history' };
                    updateOutputBar();
                }
                speak(text);
                goToSlide(0);
            });
        });
    });
    
    // 설정 - 다크모드
    document.getElementById('darkModeToggle')?.addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.target.checked);
        saveSettings();
    });
    
    // 설정 - 폰트 크기
    document.getElementById('fontSize')?.addEventListener('change', (e) => {
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${e.target.value}`);
        applyFontSize(e.target.value);
        saveSettings();
    });
    
    // 카드 추가 모달
    document.getElementById('newCardText')?.addEventListener('input', updateCardPreview);
    document.getElementById('closeAddCardModal')?.addEventListener('click', closeAddCardModal);
    document.getElementById('cancelAddCard')?.addEventListener('click', closeAddCardModal);
    document.getElementById('confirmAddCard')?.addEventListener('click', confirmAddCard);
    
    // 확인 모달 버튼
    document.getElementById('confirmCancel')?.addEventListener('click', () => {
        closeConfirmModal(false);
    });
    
    document.getElementById('confirmOk')?.addEventListener('click', () => {
        closeConfirmModal(true);
    });
}

// ========================================
// 초기화
// ========================================
function init() {
    console.log('🔄 초기화 시작...');
    
    // 로컬 데이터 로드
    loadLocalData();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 초기 렌더링
    renderCards('action');
    createPainButtons();
    updateOutputBar();
    
    // Lucide 아이콘 생성
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        console.log('✅ Lucide 아이콘 생성 완료');
    } else {
        console.error('❌ Lucide 로드 안됨');
    }
    
    console.log('✅ AAC 앱 초기화 완료');
}

// ========================================
// 앱 시작
// ========================================
window.onload = function() {
    init();
};