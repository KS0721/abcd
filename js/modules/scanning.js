/**
 * scanning.js - 2단계 행-열 스캐닝 접근 기능
 * 권순복 & 김수진(2019) 연구 기반: 운동 장애 사용자를 위한 대체 입력 방식
 *
 * ┌─────────────────────────────────────────────────┐
 * │  [스캐닝 흐름]                                    │
 * │                                                   │
 * │  1단계 (카테고리)                                  │
 * │    카테고리 탭을 순차 하이라이트                     │
 * │    → 스페이스/엔터로 선택                           │
 * │                                                   │
 * │  2단계 (카드)                                      │
 * │    [⬅ 돌아가기] → 카드1 → 카드2 → ... → 카드N      │
 * │                                                   │
 * │    · 카드 선택 → 문장에 추가, 같은 카테고리 계속     │
 * │    · [⬅ 돌아가기] 선택 → 즉시 카테고리 단계로 복귀  │
 * │    · 카드 끝까지 한 바퀴 돌면 → 자동 카테고리 복귀   │
 * └─────────────────────────────────────────────────┘
 *
 * 자동 모드: 일정 간격 자동 이동, 스페이스/엔터 = 선택
 * 단계별 모드: 스페이스 = 다음, 엔터 = 선택
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
    items: [],             // 현재 스캔 대상 목록 (DOM 요소 배열)

    // 카드 단계 추적
    cardStartIndex: 0,     // 카드 선택 후 다시 시작한 인덱스 (한 바퀴 감지용)
    hasLooped: false,      // 한 바퀴 돌았는지
    backBtnEl: null,       // "돌아가기" 가상 버튼 DOM

    // === 초기화 ===
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.injectStyles();
        console.log('✅ 스캐닝 모듈 초기화 (2단계 행-열 스캐닝)');
    },

    // === CSS 스타일 삽입 ===
    injectStyles() {
        if (document.getElementById('scanning-styles')) return;

        const style = document.createElement('style');
        style.id = 'scanning-styles';
        style.textContent = `
            /* 스캐닝 하이라이트 공통 */
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

            @keyframes scanPulse {
                from { box-shadow: 0 0 10px var(--scan-color, #FF6B00); }
                to   { box-shadow: 0 0 25px var(--scan-color, #FF6B00); }
            }

            /* ⬅ 돌아가기 버튼 (카드 그리드 맨 앞에 삽입) */
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
                width: 32px;
                height: 32px;
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

            /* 스캐닝 인디케이터 */
            .scanning-indicator {
                position: fixed;
                top: 60px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--color-primary, #FF6B00);
                color: white;
                padding: 8px 20px;
                border-radius: 20px;
                display: none;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 600;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                white-space: nowrap;
                transition: background 0.3s;
            }
            .scanning-indicator.active {
                display: flex;
            }
            .scanning-indicator.phase-card {
                background: #2563EB;
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

        // 키보드
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
    //  스캐닝 제어
    // ============================================================

    start() {
        this.isActive = true;
        this.phase = 'category';
        this.currentIndex = 0;
        this.hasLooped = false;

        document.documentElement.style.setProperty('--scan-color', this.highlightColor);
        this.updateIndicator();
        this.collectCategories();

        if (this.items.length === 0) {
            console.warn('스캐닝: 카테고리가 없습니다');
            return;
        }

        this.beginScan();
        console.log('🔄 스캐닝 시작 [카테고리]', this.method, this.speed + 'ms');
    },

    stop() {
        this.isActive = false;
        this.stopTimer();
        this.clearHighlight();
        this.removeBackButton();
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
        const bar = document.getElementById('categoryBar');
        this.items = bar ? Array.from(bar.querySelectorAll('.category-tab')) : [];
    },

    collectCards() {
        const grid = document.getElementById('cardsGrid') || document.querySelector('.cards-grid');
        if (!grid) { this.items = []; return; }
        this.items = Array.from(grid.querySelectorAll('.card:not(.hidden):not(.card-add)'));
    },

    // ============================================================
    //  ⬅ 돌아가기 버튼 관리
    // ============================================================

    /** 카드 그리드 맨 앞에 "돌아가기" 버튼 삽입 */
    insertBackButton() {
        this.removeBackButton();

        const grid = document.getElementById('cardsGrid') || document.querySelector('.cards-grid');
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

    /** 돌아가기 버튼 제거 */
    removeBackButton() {
        const existing = document.getElementById('scanBackBtn');
        if (existing) existing.remove();
        this.backBtnEl = null;
    },

    // ============================================================
    //  단계 전환
    // ============================================================

    /** 카테고리 → 카드 단계 */
    enterCardPhase() {
        this.stopTimer();
        this.clearHighlight();

        this.phase = 'card';
        this.currentIndex = 0;
        this.hasLooped = false;

        // 렌더링 대기 후 카드 수집
        setTimeout(() => {
            // ⬅ 돌아가기 버튼 삽입
            this.insertBackButton();

            // 카드 수집 (돌아가기 버튼 + 실제 카드)
            this.collectCardItems();
            this.updateIndicator();

            if (this.items.length <= 1) {
                // 돌아가기 버튼만 있고 카드가 없으면 복귀
                console.warn('스캐닝: 카드가 없어 카테고리로 복귀');
                this.returnToCategoryPhase();
                return;
            }

            // 돌아가기 버튼(index 0)부터 시작
            this.currentIndex = 0;
            this.cardStartIndex = 0;
            this.beginScan();
            console.log('🔄 스캐닝 [카드 단계] 항목 수:', this.items.length,
                        '(돌아가기 1 + 카드', this.items.length - 1, '개)');
        }, 250);
    },

    /** 카드 + 돌아가기 버튼 통합 수집 */
    collectCardItems() {
        const grid = document.getElementById('cardsGrid') || document.querySelector('.cards-grid');
        if (!grid) { this.items = []; return; }

        // 돌아가기 버튼 + 실제 카드 (순서대로)
        const backBtn = grid.querySelector('.scan-back-btn');
        const cards = Array.from(grid.querySelectorAll('.card:not(.hidden):not(.card-add)'));

        this.items = backBtn ? [backBtn, ...cards] : cards;
    },

    /** 카드 → 카테고리 단계 복귀 */
    returnToCategoryPhase() {
        this.stopTimer();
        this.clearHighlight();
        this.removeBackButton();

        this.phase = 'category';
        this.currentIndex = 0;
        this.hasLooped = false;

        this.collectCategories();
        this.updateIndicator();

        // 현재 활성 카테고리 다음부터 시작 (이미 선택한 카테고리를 건너뜀)
        const activeTab = document.querySelector('.category-tab.active');
        if (activeTab) {
            const idx = this.items.indexOf(activeTab);
            if (idx >= 0) {
                // 다음 카테고리부터 시작 (다른 단어를 고르러 갈 확률이 높으므로)
                this.currentIndex = (idx + 1) % this.items.length;
            }
        }

        this.beginScan();
        console.log('🔄 스캐닝 [카테고리 복귀]');
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

    /** 다음으로 이동 */
    moveNext() {
        if (this.items.length === 0) return;
        this.clearHighlight();

        const prevIndex = this.currentIndex;
        this.currentIndex = (this.currentIndex + 1) % this.items.length;

        // ── 카드 단계: 한 바퀴 감지 ──
        if (this.phase === 'card' && this.currentIndex === 0) {
            // index가 0(돌아가기 버튼)으로 돌아왔다 = 한 바퀴 완료
            if (this.hasLooped) {
                // 이미 한 번 돌았으므로 카테고리로 자동 복귀
                console.log('🔁 카드 한 바퀴 완료 → 카테고리로 자동 복귀');
                this.returnToCategoryPhase();
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
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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

        if (this.phase === 'category') {
            // ── 카테고리 선택 ──
            this.stopTimer();
            this.clearHighlight();
            el.click();
            console.log('📂 카테고리 선택:', el.querySelector('span')?.textContent || el.textContent.trim());
            this.enterCardPhase();

        } else {
            // ── 카드 단계 ──
            this.stopTimer();
            this.clearHighlight();

            // 돌아가기 버튼인지 확인
            if (el.classList.contains('scan-back-btn')) {
                console.log('⬅ 돌아가기 선택 → 카테고리 복귀');
                this.returnToCategoryPhase();
                return;
            }

            // 실제 카드 선택
            el.click();
            console.log('🃏 카드 선택:', el.dataset.id);

            // 같은 카테고리에서 계속 스캔 (카드 목록 갱신 후 이어서)
            setTimeout(() => {
                this.collectCardItems();

                if (this.items.length <= 1) {
                    // 카드가 다 사라졌으면 복귀
                    this.returnToCategoryPhase();
                    return;
                }

                // 한 바퀴 카운터 리셋 (새로 선택했으므로 다시 한 바퀴 기회)
                this.hasLooped = false;

                // 다음 카드부터 계속 스캔
                if (this.currentIndex >= this.items.length) {
                    this.currentIndex = 0;
                }

                this.beginScan();
            }, 300);
        }
    },

    // ============================================================
    //  인디케이터
    // ============================================================

    updateIndicator() {
        const indicator = document.getElementById('scanningIndicator');
        if (!indicator) return;

        indicator.classList.add('active');

        const hint = this.method === 'auto'
            ? '스페이스/엔터 = 선택'
            : '스페이스 = 이동 · 엔터 = 선택';

        if (this.phase === 'category') {
            indicator.classList.remove('phase-card');
            indicator.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                📁 카테고리 선택 · ${hint}
            `;
        } else {
            indicator.classList.add('phase-card');
            indicator.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <path d="M12 8v8"/>
                    <path d="M8 12h8"/>
                </svg>
                🃏 카드 선택 · ${hint}
            `;
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
