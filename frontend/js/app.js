// ========================================
// app.js - 초기화, 이벤트 연결
//
// [보호자 가이드 모듈 근거]
// - Sennott, Light & McNaughton (2016). AAC Modeling Intervention
//   Research Review. RPSD, 41(2), 101-115.
//   : 파트너 모델링이 화용/의미/구문/형태론 4개 영역 향상
// - Kent-Walsh, Murza, Malani & Binger (2015). Effects of
//   Communication Partner Instruction. AAC, 31(4), 271-284.
//   : 파트너 중재 메타분석 - 모델링, 기대 지연, 개방형 질문이 효과적
// - Allen, Schlosser, Brock & Shane (2017). Effects of Aided AAC
//   Input on Communication. JSLHR, 60(3), 834-854.
//   : 보조 AAC 입력이 표현/이해 향상, 파트너 활용 권장
// - Beukelman & Light (2020). AAC (5th ed.). Brookes.
//   : 참여 모델(Participation Model) - 의사소통 파트너 훈련 필수
// ========================================
console.log('🚀 app.js 로드됨');

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
            vibrate();
            goToSlide(parseInt(btn.dataset.slide));
        });
    });
    
    // 카테고리 탭
    document.querySelectorAll('.category-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            vibrate();
            document.querySelectorAll('.category-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCards(btn.dataset.category);
        });
    });
    
    // 스와이프
    document.querySelector('.slide-container')?.addEventListener('touchstart', e => {
        isSwipingInCategoryTabs = e.target.closest('.category-tabs') !== null;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.querySelector('.slide-container')?.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (!isSwipingInCategoryTabs) handleSwipe();
        isSwipingInCategoryTabs = false;
    }, { passive: true });
    
    // 출력 바 버튼
    document.getElementById('speakBtn')?.addEventListener('click', () => {
        if (State.currentMessage) {
            vibrate();
            showListenerModal(State.currentMessage, State.currentIcon, false);
            speak(State.currentMessage);
            addToHistory(State.currentMessage);
        }
    });
    
    document.getElementById('showBtn')?.addEventListener('click', () => {
        if (State.currentMessage) {
            vibrate();
            showListenerModal(State.currentMessage, State.currentIcon, false);
            addToHistory(State.currentMessage);
        }
    });
    
    document.getElementById('clearBtn')?.addEventListener('click', () => {
        vibrate();
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
            vibrate(100);
            const text = btn.dataset.text;
            const icon = btn.dataset.icon || 'alert-triangle';
            clearSelection();
            Selection.predicate = { text, icon, displayText: text, category: 'emergency' };
            updateOutputBar();
            speak(text);
            showListenerModal(text, icon, true);
            addToHistory(text);
        });
    });
    
    // 청자 모달 닫기
    document.getElementById('closeListenerModal')?.addEventListener('click', () => {
        vibrate();
        closeListenerModal();
    });
    
    // 기록 삭제
    document.getElementById('clearHistoryBtn')?.addEventListener('click', async () => {
        vibrate();
        if (State.sentenceHistory.length === 0) { alert('삭제할 기록이 없습니다'); return; }
        const confirmed = await showConfirmModal('모든 기록을 삭제할까요?');
        if (confirmed) {
            State.sentenceHistory = [];
            saveHistory();
            renderHistory();
        }
    });
    
    // [제거됨] 검색 기능
    // AAC 사용자 대부분 키보드 입력 불가 → 검색은 장벽
    
    // 설정 - 고대비 모드 (다크모드 통합)
    document.getElementById('highContrastToggle')?.addEventListener('change', (e) => {
        vibrate();
        document.body.classList.toggle('high-contrast', e.target.checked);
        document.body.classList.toggle('dark-mode', e.target.checked);
        saveSettings();
    });
    
    // 설정 - 폰트 크기
    document.getElementById('fontSize')?.addEventListener('change', (e) => {
        vibrate();
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${e.target.value}`);
        applyFontSize(e.target.value);
        saveSettings();
    });
    
    // 설정 - 진동
    document.getElementById('vibrationToggle')?.addEventListener('change', () => {
        vibrate();
        saveSettings();
    });
    
    // 설정 - 롱프레스 시간
    document.getElementById('longPressTime')?.addEventListener('change', () => {
        vibrate();
        saveSettings();
    });
    
    // 카드 추가 모달
    document.getElementById('newCardText')?.addEventListener('input', updateCardPreview);
    document.getElementById('closeAddCardModal')?.addEventListener('click', () => { vibrate(); closeAddCardModal(); });
    document.getElementById('cancelAddCard')?.addEventListener('click', () => { vibrate(); closeAddCardModal(); });
    document.getElementById('confirmAddCard')?.addEventListener('click', () => { vibrate(); confirmAddCard(); });
    
    // 확인 모달
    document.getElementById('confirmCancel')?.addEventListener('click', () => { vibrate(); closeConfirmModal(false); });
    document.getElementById('confirmOk')?.addEventListener('click', () => { vibrate(); closeConfirmModal(true); });
}

// ========================================
// 초기화
// ========================================
function init() {
    console.log('🔄 초기화 시작...');
    loadLocalData();
    setupEventListeners();
    renderCards('core');  // 핵심어휘부터 시작
    createPainButtons();
    updateOutputBar();
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
        console.log('✅ Lucide 아이콘 생성 완료');
    }
    
    console.log('✅ AAC 앱 초기화 완료');
}

window.onload = function() { init(); };