/**
 * scanning.js - 2단계 행-열 스캐닝 접근 기능
 * 권순복 & 김수진(2019) 연구 기반: 운동 장애 사용자를 위한 대체 입력 방식
 *
 * ┌─────────────────────────────────────────────────┐
 * │  [스캐닝 흐름]                                    │
 * │                                                   │
 * │  1단계 (카테고리)                                  │
 * │    카테고리 탭을 순차 하이라이트                     │
 * │    → 터치/스페이스/엔터로 선택                      │
 * │                                                   │
 * │  2단계 (카드)                                      │
 * │    [⬅ 돌아가기] → 카드1 → 카드2 → ... → 카드N      │
 * │                                                   │
 * │    · 카드 선택 → 문장에 추가, 같은 카테고리 계속     │
 * │    · [⬅ 돌아가기] 선택 → 즉시 카테고리 단계로 복귀  │
 * │    · 카드 끝까지 한 바퀴 돌면 → 자동 카테고리 복귀   │
 * └─────────────────────────────────────────────────┘
 *
 * 입력 방식:
 *   PC: 스페이스/엔터 키보드
 *   모바일: 화면 하단 터치 영역 탭
 *   외부: 블루투스 스위치 (키보드로 인식됨)
 *
 * 자동 모드: 일정 간격 자동 이동, 입력 = 선택
 * 단계별 모드: 입력1 = 다음, 입력2 = 선택 (또는 더블탭)
 */

const ScanningModule = {
    // === 상태 ===
    isActive: false,
    currentIndex: 0,
    scanInterval: null,
    speed: 2000,
    method: 'auto',        // 'auto' | 'step'
    highlightColor: '#FF6B00',

    // 2단계 스캐닝 상태
    phase: 'category',     // 'category' | 'card'
    items: [],

    // 카드 단계 추적
    cardStartIndex: 0,
    hasLooped: false,
    backBtnEl: null,

    // 터치 지원
    touchOverlay: null,
    isMobile: false,

    // === 초기화 ===
    init() {
        this.isMobile = this.detectMobile();
        this.loadSettings();
        this.setupEventListeners();
        this.injectStyles();
        console.log('✅ 스캐닝 모듈 초기화 (2단계 행-열, 터치 지원)');
    },

    detectMobile() {
        return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
            || ('ontouchstart' in window)
            || (window.innerWidth <= 768);
    },

    // === CSS 스타일 삽입 ===
    injectStyles() {
        if (document.getElementById('scanning-styles')) return;

        const style = document.createElement('style');
        style.id = 'scanning-styles';
        style.textContent = `
            /* 스캐닝 하이라이트 */
            .scanning-highlight {
                outline: 4px solid var(--scan-color, #FF6B00) !important;
                outline-offset: 2px !important;
                z-index: 10 !important;
                box-shadow: 0 0 20px var(--scan-color, #FF6B00) !important;
                animation: scanPulse 0.5s ease-in-out infinite alternate !important;
                position: relative !important;
            }
            .card.scanning-highlight {
                transform: scale(1.05) !important;
            }
            .category-tab.scanning-highlight {
                transform: scale(1.08) !important;
            }
            .menu-tile.scanning-highlight {
                transform: scale(1.06) !important;
                outline-offset: 4px !important;
            }
            .situation-card.scanning-highlight {
                transform: scale(1.05) !important;
            }
            .close-btn.scanning-highlight {
                transform: scale(1.3) !important;
                outline-offset: 6px !important;
                background: rgba(255,107,0,0.2) !important;
                border-radius: 50% !important;
            }

            @keyframes scanPulse {
                from { box-shadow: 0 0 10px var(--scan-color, #FF6B00); }
                to   { box-shadow: 0 0 25px var(--scan-color, #FF6B00); }
            }

            /* ⬅ 돌아가기 버튼 */
            .scan-back-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 12px 8px;
                background: var(--color-surface, #fff);
                border: 3px dashed var(--color-primary, #FF6B00);
                border-radius: var(--card-radius, 16px);
                cursor: pointer;
                transition: all 0.2s;
                min-height: 100px;
                color: var(--color-primary, #FF6B00);
            }
            .scan-back-btn svg {
                width: 32px; height: 32px;
                stroke: currentColor;
            }
            .scan-back-btn span {
                font-size: var(--font-size-sm, 14px);
                font-weight: 700;
            }
            .scan-back-btn.scanning-highlight {
                background: var(--color-primary-bg, #FFF7ED) !important;
                border-style: solid !important;
            }

            /* 스캐닝 인디케이터 (최소화) */
            .scanning-indicator {
                position: fixed;
                top: 60px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--color-primary, #FF6B00);
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                display: none;
                align-items: center;
                justify-content: center;
                gap: 4px;
                font-size: 11px;
                font-weight: 600;
                z-index: 9999;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                white-space: nowrap;
                transition: background 0.3s;
                max-width: calc(100vw - 32px);
                pointer-events: none;
                opacity: 0.85;
            }
            .scanning-indicator.active {
                display: flex;
            }
            .scanning-indicator.phase-card {
                background: #2563EB;
            }

            /* ===== 스캐닝 모드 표시: 화면 테두리 ===== */
            body.scanning-mode-active {
                box-shadow: inset 0 0 0 3px var(--scan-color, #FF6B00);
            }

            /* ===== 모바일 터치 버튼 (탭바 위) ===== */
            .scan-touch-overlay {
                display: none;
                position: fixed;
                bottom: 60px;
                left: 0;
                right: 0;
                z-index: 9998;
                justify-content: center;
                gap: 8px;
                padding: 0 16px 4px;
                pointer-events: none;
            }
            .scan-touch-overlay.active {
                display: flex;
            }
            .scan-touch-btn {
                pointer-events: auto;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                font-size: 13px;
                font-weight: 700;
                color: white;
                border: none;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                -webkit-tap-highlight-color: transparent;
                border-radius: 24px;
                padding: 8px 18px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                min-height: 36px;
            }
            .scan-touch-btn:active {
                filter: brightness(0.85);
                transform: scale(0.95);
            }
            .scan-touch-btn.btn-select {
                background: var(--scan-color, #FF6B00);
            }
            .scan-touch-btn.btn-next {
                background: #6B7280;
            }
        `;
        document.head.appendChild(style);
    },

    // === 설정 ===
    loadSettings() {
        const saved = localStorage.getItem('aac_scanning_settings');
        if (saved) {
            try {
                const s = JSON.parse(saved);
                this.speed = s.speed || 2000;
                this.method = s.method || 'auto';
                this.highlightColor = s.color || '#FF6B00';
            } catch (e) { /* 무시 */ }
        }
    },

    saveSettings() {
        localStorage.setItem('aac_scanning_settings', JSON.stringify({
            speed: this.speed,
            method: this.method,
            color: this.highlightColor
        }));
    },

    // === 이벤트 리스너 ===
    setupEventListeners() {
        // 스캐닝 토글
        const scanToggle = document.getElementById('scanningToggle');
        if (scanToggle) {
            scanToggle.addEventListener('change', (e) => {
                e.target.checked ? this.start() : this.stop();
                this.toggleSettingsVisibility(e.target.checked);
            });
        }

        // 속도
        const speedSelect = document.getElementById('scanSpeedSelect');
        if (speedSelect) {
            speedSelect.addEventListener('change', (e) => {
                this.speed = parseInt(e.target.value);
                this.saveSettings();
                if (this.isActive) this.restart();
            });
        }

        // 방식
        const methodSelect = document.getElementById('scanMethodSelect');
        if (methodSelect) {
            methodSelect.addEventListener('change', (e) => {
                this.method = e.target.value;
                this.saveSettings();
                if (this.isActive) this.restart();
            });
        }

        // 색상
        const colorSelect = document.getElementById('scanColorSelect');
        if (colorSelect) {
            colorSelect.addEventListener('change', (e) => {
                this.highlightColor = e.target.value;
                document.documentElement.style.setProperty('--scan-color', this.highlightColor);
                this.saveSettings();
            });
        }

        // 키보드 (PC + 블루투스 스위치)
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            if (e.code !== 'Space' && e.code !== 'Enter') return;
            e.preventDefault();

            if (this.method === 'step') {
                e.code === 'Space' ? this.moveNext() : this.selectCurrent();
            } else {
                this.selectCurrent();
            }
        });
    },

    toggleSettingsVisibility(show) {
        ['scanSpeedItem', 'scanMethodItem', 'scanColorItem'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = show ? 'flex' : 'none';
        });
    },

    // ============================================================
    //  모바일 터치 오버레이
    // ============================================================

    createTouchOverlay() {
        this.removeTouchOverlay();

        const overlay = document.createElement('div');
        overlay.className = 'scan-touch-overlay';
        overlay.id = 'scanTouchOverlay';

        if (this.method === 'auto') {
            overlay.innerHTML = `
                <button class="scan-touch-btn btn-select" id="scanTouchSelect" type="button">
                    👆 선택
                </button>
            `;
        } else {
            overlay.innerHTML = `
                <button class="scan-touch-btn btn-next" id="scanTouchNext" type="button">
                    ▶ 다음
                </button>
                <button class="scan-touch-btn btn-select" id="scanTouchSelect" type="button">
                    👆 선택
                </button>
            `;
        }

        document.body.appendChild(overlay);
        document.body.classList.add('scanning-touch-active');
        this.touchOverlay = overlay;

        // this 바인딩을 명시적으로 보존
        const self = this;
        let touchFired = false;  // 터치-클릭 중복 방지

        const selectBtn = document.getElementById('scanTouchSelect');
        if (selectBtn) {
            selectBtn.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                touchFired = true;
                if (navigator.vibrate) navigator.vibrate(30);
                self.selectCurrent();
                setTimeout(() => { touchFired = false; }, 300);
            }, { passive: false });
            selectBtn.addEventListener('click', function(e) {
                if (touchFired) return;  // 터치로 이미 처리됨
                e.preventDefault();
                e.stopPropagation();
                self.selectCurrent();
            });
        }

        const nextBtn = document.getElementById('scanTouchNext');
        if (nextBtn) {
            nextBtn.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                touchFired = true;
                if (navigator.vibrate) navigator.vibrate(20);
                self.moveNext();
                setTimeout(() => { touchFired = false; }, 300);
            }, { passive: false });
            nextBtn.addEventListener('click', function(e) {
                if (touchFired) return;
                e.preventDefault();
                e.stopPropagation();
                self.moveNext();
            });
        }

        overlay.classList.add('active');
    },

    removeTouchOverlay() {
        const existing = document.getElementById('scanTouchOverlay');
        if (existing) existing.remove();
        document.body.classList.remove('scanning-touch-active');
        this.touchOverlay = null;
    },

    // ============================================================
    //  스캐닝 제어
    // ============================================================

    start() {
        this.isActive = true;
        this.phase = 'menu';
        this.currentIndex = 0;
        this.hasLooped = false;
        this.selectedMenu = null; // 'speak' or 'situation'

        document.documentElement.style.setProperty('--scan-color', this.highlightColor);
        
        // 메인 메뉴로 이동
        const menu = document.getElementById('mainMenu');
        const app = document.getElementById('app');
        if (menu && app) {
            app.style.display = 'none';
            menu.style.display = 'flex';
        }

        this.updateIndicator();
        this.collectMenuItems();

        // 모바일이면 터치 오버레이 생성
        this.createTouchOverlay();
        document.body.classList.add('scanning-mode-active');

        this.beginScan();
        console.log('🔄 스캐닝 시작 [메뉴 단계]', this.method, this.speed + 'ms');
    },

    stop() {
        this.isActive = false;
        this.stopTimer();
        this.clearHighlight();
        this.removeBackButton();
        this.removeTouchOverlay();
        document.body.classList.remove('scanning-mode-active');
        this.phase = 'category';
        this.items = [];

        const ind = document.getElementById('scanningIndicator');
        if (ind) ind.classList.remove('active', 'phase-card');
        console.log('⏹ 스캐닝 정지');
    },

    restart() {
        this.stop();
        setTimeout(() => this.start(), 150);
    },

    // ============================================================
    //  항목 수집
    // ============================================================

    collectCategories() {
        if (this.selectedMenu === 'situation') {
            // 상황판: 상황 카드 영역이 열려있으면 skip (이미 카드 단계)
            const sitArea = document.getElementById('situationCardsArea');
            if (sitArea && sitArea.style.display !== 'none') {
                return;
            }
            // 상황 그리드에서 상황 카드들
            const sitGrid = document.getElementById('situationGrid');
            if (sitGrid) {
                this.items = Array.from(sitGrid.querySelectorAll('.situation-card'));
            } else {
                this.items = [];
            }
        } else {
            // 말하기: 카테고리 바
            const bar = document.getElementById('categoryBar');
            this.items = bar ? Array.from(bar.querySelectorAll('.category-tab')) : [];
        }
    },

    collectCards() {
        if (this.selectedMenu === 'situation') {
            // 상황판 카드 그리드
            const sitGrid = document.getElementById('situationCardsGrid');
            if (sitGrid) {
                this.items = Array.from(sitGrid.querySelectorAll('.card:not(.hidden):not(.card-add)'));
            } else {
                this.items = [];
            }
        } else {
            // 말하기 카드 그리드
            const grid = document.getElementById('cardsGrid');
            if (!grid) { this.items = []; return; }
            this.items = Array.from(grid.querySelectorAll('.card:not(.hidden):not(.card-add)'));
        }
    },

    collectMenuItems() {
        const menu = document.getElementById('mainMenu');
        if (!menu) { this.items = []; return; }
        // 말하기, 상황 타일만 (기록/설정은 스캐닝 불필요)
        this.items = Array.from(menu.querySelectorAll('.menu-tile[data-target="speak"], .menu-tile[data-target="situation"]'));
    },

    // ============================================================
    //  ⬅ 돌아가기 버튼
    // ============================================================

    insertBackButton() {
        this.removeBackButton();
        let grid;
        if (this.selectedMenu === 'situation') {
            grid = document.getElementById('situationCardsGrid');
        } else {
            grid = document.getElementById('cardsGrid');
        }
        if (!grid) return null;

        const btn = document.createElement('div');
        btn.className = 'scan-back-btn';
        btn.id = 'scanBackBtn';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5">
                <polyline points="15 18 9 12 15 6"/>
            </svg>
            <span>돌아가기</span>
        `;

        grid.insertBefore(btn, grid.firstChild);
        this.backBtnEl = btn;
        return btn;
    },

    removeBackButton() {
        const existing = document.getElementById('scanBackBtn');
        if (existing) existing.remove();
        this.backBtnEl = null;
    },

    // ============================================================
    //  단계 전환
    // ============================================================

    enterCardPhase() {
        this.stopTimer();
        this.clearHighlight();

        this.phase = 'card';
        this.currentIndex = 0;
        this.hasLooped = false;

        setTimeout(() => {
            this.insertBackButton();
            this.collectCardItems();
            this.updateIndicator();

            if (this.items.length <= 1) {
                console.warn('스캐닝: 카드가 없어 카테고리로 복귀');
                this.returnToCategoryPhase();
                return;
            }

            this.currentIndex = 0;
            this.cardStartIndex = 0;
            this.beginScan();
            console.log('🔄 스캐닝 [카드 단계] 항목 수:', this.items.length);
        }, 250);
    },

    collectCardItems() {
        let grid;
        if (this.selectedMenu === 'situation') {
            grid = document.getElementById('situationCardsGrid');
        } else {
            grid = document.getElementById('cardsGrid');
        }
        if (!grid) { this.items = []; return; }

        const backBtn = grid.querySelector('.scan-back-btn');
        const cards = Array.from(grid.querySelectorAll('.card:not(.hidden):not(.card-add)'));
        this.items = backBtn ? [backBtn, ...cards] : cards;
    },

    returnToCategoryPhase() {
        this.stopTimer();
        this.clearHighlight();
        this.removeBackButton();

        // 카드 단계 → 카테고리 단계로 복귀 (메뉴 아님)
        this.phase = 'category';
        this.currentIndex = 0;
        this.hasLooped = false;

        // 상황판이면 상황 카드 목록으로 돌아가기
        if (this.selectedMenu === 'situation') {
            // situationCardsArea 숨기고 situationGrid 다시 보이기
            const sitArea = document.getElementById('situationCardsArea');
            const sitGrid = document.getElementById('situationGrid');
            if (sitArea) sitArea.style.display = 'none';
            if (sitGrid) sitGrid.style.display = 'grid';
        }

        this.collectCategories();
        this.updateIndicator();
        this.beginScan();
        console.log('🔄 스캐닝 [카테고리 복귀]');
    },
    
    returnToMenu() {
        this.stopTimer();
        this.clearHighlight();
        this.removeBackButton();

        this.phase = 'menu';
        this.currentIndex = 0;
        this.hasLooped = false;
        
        // 앱 숨기고 메인 메뉴 표시
        const menu = document.getElementById('mainMenu');
        const app = document.getElementById('app');
        if (menu && app) {
            app.style.display = 'none';
            menu.style.display = 'flex';
        }

        this.collectMenuItems();
        this.updateIndicator();
        this.beginScan();
        console.log('🔄 스캐닝 [메뉴 복귀]');
    },

    // 크게보기 모달 단계: X닫기 버튼을 스캔
    enterModalPhase() {
        const modal = document.getElementById('listenerModal');
        if (!modal || !modal.classList.contains('active')) {
            // 모달이 안 열렸으면 카드 스캔으로 복귀
            this.resumeCardScan();
            return;
        }
        
        this.phase = 'modal';
        this.currentIndex = 0;
        this.hasLooped = false;
        
        const closeBtn = document.getElementById('closeListenerModal');
        this.items = closeBtn ? [closeBtn] : [];
        
        this.updateIndicator();
        
        if (this.items.length > 0) {
            // 자동 모드: 일정 시간 후 자동으로 X 하이라이트
            this.highlight(0);
            if (this.method === 'auto') {
                this.startTimer();
            }
        }
        console.log('🔄 스캐닝 [모달 단계] X버튼 대기');
    },
    
    // 카드 스캔 재개 (모달 닫힌 후)
    resumeCardScan() {
        this.phase = 'card';
        this.currentIndex = 0;
        this.hasLooped = false;
        
        setTimeout(() => {
            this.insertBackButton();
            this.collectCardItems();
            this.updateIndicator();
            
            if (this.items.length <= 1) {
                this.returnToCategoryPhase();
                return;
            }
            
            this.currentIndex = 0;
            this.beginScan();
            console.log('🔄 스캐닝 [카드 스캔 재개]');
        }, 300);
    },

    // ============================================================
    //  스캔 동작
    // ============================================================

    beginScan() {
        if (this.items.length === 0) return;
        if (this.currentIndex >= this.items.length) this.currentIndex = 0;

        this.highlight(this.currentIndex);
        if (this.method === 'auto') this.startTimer();
    },

    startTimer() {
        this.stopTimer();
        this.scanInterval = setInterval(() => this.moveNext(), this.speed);
    },

    stopTimer() {
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
    },

    moveNext() {
        if (this.items.length === 0) return;
        this.clearHighlight();

        this.currentIndex = (this.currentIndex + 1) % this.items.length;

        // 카드 단계: 2바퀴 돌면 → 카테고리로 자동 복귀
        if (this.phase === 'card' && this.currentIndex === 0) {
            if (this.hasLooped) {
                console.log('🔁 카드 한 바퀴 완료 → 카테고리로 자동 복귀');
                this.returnToCategoryPhase();
                return;
            }
            this.hasLooped = true;
        }
        
        // 카테고리 단계: 2바퀴 돌면 → 메뉴로 자동 복귀
        if (this.phase === 'category' && this.currentIndex === 0) {
            if (this.hasLooped) {
                console.log('🔁 카테고리 한 바퀴 완료 → 메뉴로 자동 복귀');
                this.returnToMenu();
                return;
            }
            this.hasLooped = true;
        }

        this.highlight(this.currentIndex);
    },

    highlight(index) {
        if (index < 0 || index >= this.items.length) return;
        const el = this.items[index];
        el.classList.add('scanning-highlight');
        
        // 카테고리 탭: 카테고리 바 안에서만 수평 스크롤 (페이지 이동 방지)
        if (this.phase === 'category') {
            const bar = el.closest('.category-bar, #categoryBar');
            if (bar) {
                const barRect = bar.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                if (elRect.left < barRect.left || elRect.right > barRect.right) {
                    const scrollLeft = bar.scrollLeft + (elRect.left - barRect.left) - (barRect.width / 2) + (elRect.width / 2);
                    bar.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                }
            }
        } else {
            // 카드: cards-area 안에서만 수직 스크롤 (페이지 이동 방지)
            const scrollArea = el.closest('.cards-area, .situation-cards-area');
            if (scrollArea) {
                const areaRect = scrollArea.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                if (elRect.top < areaRect.top || elRect.bottom > areaRect.bottom) {
                    const scrollTop = scrollArea.scrollTop + (elRect.top - areaRect.top) - (areaRect.height / 2) + (elRect.height / 2);
                    scrollArea.scrollTo({ top: scrollTop, behavior: 'smooth' });
                }
            }
        }
    },

    clearHighlight() {
        document.querySelectorAll('.scanning-highlight').forEach(el => {
            el.classList.remove('scanning-highlight');
        });
    },

    // ============================================================
    //  선택
    // ============================================================

    selectCurrent() {
        if (this.currentIndex < 0 || this.currentIndex >= this.items.length) return;

        const el = this.items[this.currentIndex];
        if (navigator.vibrate) navigator.vibrate(100);

        if (this.phase === 'modal') {
            // 모달 단계: X버튼 선택 → 모달 닫기 → 카드 스캔 재개
            this.stopTimer();
            this.clearHighlight();
            el.click();
            console.log('✕ 모달 닫기 → 카드 스캔 재개');
            setTimeout(() => this.resumeCardScan(), 400);
            return;
        }

        if (this.phase === 'menu') {
            // 메뉴 단계: 말하기 또는 상황 선택
            this.stopTimer();
            this.clearHighlight();
            
            const target = el.dataset.target;
            this.selectedMenu = target;
            
            // 메뉴에서 앱으로 전환
            const menu = document.getElementById('mainMenu');
            const app = document.getElementById('app');
            if (menu && app) {
                menu.style.display = 'none';
                app.style.display = 'flex';
            }
            
            // 해당 슬라이드로 이동
            if (target === 'speak') {
                // goToSlide는 외부 함수 → 직접 실행
                const wrapper = document.getElementById('slideWrapper');
                if (wrapper) wrapper.style.transform = 'translateX(0%)';
                document.querySelectorAll('.tab-bar-btn').forEach((btn, i) => btn.classList.toggle('active', i === 0));
                
                console.log('📱 메뉴→말하기 선택');
                // 카테고리 단계로
                setTimeout(() => this.enterCategoryFromMenu(), 300);
            } else if (target === 'situation') {
                const wrapper = document.getElementById('slideWrapper');
                if (wrapper) wrapper.style.transform = 'translateX(-100%)';
                document.querySelectorAll('.tab-bar-btn').forEach((btn, i) => btn.classList.toggle('active', i === 1));
                
                console.log('📱 메뉴→상황판 선택');
                // 상황판의 카테고리(상황 카드들)를 스캔
                setTimeout(() => this.enterSituationScan(), 300);
            }

        } else if (this.phase === 'category') {
            this.stopTimer();
            this.clearHighlight();
            el.click();
            console.log('📂 카테고리 선택:', el.querySelector('span')?.textContent || el.textContent.trim());
            this.enterCardPhase();

        } else {
            // 카드 단계
            this.stopTimer();
            this.clearHighlight();

            if (el.classList.contains('scan-back-btn')) {
                console.log('⬅ 돌아가기 선택 → 카테고리 복귀');
                this.returnToCategoryPhase();
                return;
            }

            el.click();
            console.log('🃏 카드 선택:', el.dataset.id);

            // 스캐닝 모드에서는 카드 선택 즉시 크게보기 실행
            setTimeout(() => {
                const showBtn = document.getElementById('showBtn');
                if (showBtn && !showBtn.disabled) {
                    showBtn.click();
                }
                // 크게보기 모달이 열리면 X버튼 스캔 단계로 진입
                setTimeout(() => this.enterModalPhase(), 500);
            }, 200);
        }
    },
    
    // 메뉴→말하기 후 카테고리 단계 진입
    enterCategoryFromMenu() {
        this.phase = 'category';
        this.currentIndex = 0;
        this.hasLooped = false;
        
        this.collectCategories();
        this.updateIndicator();
        
        if (this.items.length === 0) {
            console.warn('스캐닝: 카테고리가 없습니다');
            return;
        }
        this.beginScan();
        console.log('🔄 스캐닝 [카테고리 단계]');
    },
    
    // 메뉴→상황판 후 상황 카드 스캔
    enterSituationScan() {
        this.phase = 'category';
        this.currentIndex = 0;
        this.hasLooped = false;
        
        // 상황 그리드의 카드들을 카테고리로 수집
        const sitGrid = document.getElementById('situationGrid');
        if (sitGrid) {
            this.items = Array.from(sitGrid.querySelectorAll('.situation-card'));
        } else {
            this.items = [];
        }
        this.updateIndicator();
        
        if (this.items.length === 0) {
            console.warn('스캐닝: 상황 카드가 없습니다');
            return;
        }
        this.beginScan();
        console.log('🔄 스캐닝 [상황판 단계] 항목:', this.items.length);
    },

    // ============================================================
    //  인디케이터
    // ============================================================

    updateIndicator() {
        const indicator = document.getElementById('scanningIndicator');
        if (!indicator) return;

        indicator.classList.add('active');

        if (this.phase === 'menu') {
            indicator.classList.remove('phase-card');
            indicator.textContent = '📱 메뉴 선택';
        } else if (this.phase === 'modal') {
            indicator.classList.add('phase-card');
            indicator.textContent = '✕ 닫기 선택';
        } else if (this.phase === 'category') {
            indicator.classList.remove('phase-card');
            indicator.textContent = '📁 카테고리 선택';
        } else {
            indicator.classList.add('phase-card');
            indicator.textContent = '🃏 카드 선택';
        }
    },

    // ============================================================
    //  외부 인터페이스
    // ============================================================

    refresh() {
        if (!this.isActive) return;

        if (this.phase === 'card') {
            this.collectCardItems();
        } else {
            this.collectCategories();
        }
        if (this.currentIndex >= this.items.length) {
            this.currentIndex = 0;
        }
    }
};

export default ScanningModule;
