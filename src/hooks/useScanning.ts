// ========================================
// useScanning.ts - 스캐닝 모드 핵심 로직
// 자동 모드 전용 (3초 간격)
//
// 조작법:
//   · 터치 = 선택
//   · 꾹 누르기(1.5초) = 스캐닝 끄기
//   · 두번터치 = 화면 이동 (말하기→상황→기록→설정)
//
// 흐름: category → card → modal (tap to close)
//   · 2바퀴 순환 시 카드→카테고리 자동 복귀
//   · TTS: 하이라이트 이동 시 항목 이름 읽기
// ========================================

import { useEffect, useCallback, useRef } from 'react';
import { useScanningStore } from '../store/useScanningStore';
import type { ScanPhase } from '../store/useScanningStore';
import { useAppStore } from '../store/useAppStore';
import { DEFAULT_CATEGORIES } from '../data/cards';
import { SITUATION_BOARDS } from '../data/cards';
import type { SituationId, CategoryId, SlideIndex } from '../types';

const SITUATION_IDS = Object.keys(SITUATION_BOARDS) as SituationId[];
const SCREEN_COUNT = 4; // 말하기(0), 상황(1), 기록(2), 설정(3)

// ── TTS: 항목 이름 읽기 ──
function speakItemName(text: string) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = 1.2;
  u.volume = 0.7;
  speechSynthesis.speak(u);
}

// ── 현재 하이라이트된 항목의 이름 가져오기 ──
function getItemLabel(phase: ScanPhase, index: number): string {
  const { currentSlide } = useAppStore.getState();
  const { cards, currentCategory, activeSituation } = useAppStore.getState();

  switch (phase) {
    case 'category':
      // 상황 화면
      if (currentSlide === 1) {
        const sitId = SITUATION_IDS[index];
        return sitId ? SITUATION_BOARDS[sitId].name : '';
      }
      // 말하기 화면
      return DEFAULT_CATEGORIES[index]?.name || '';

    case 'card': {
      if (index === 0) return '돌아가기';
      // 상황 화면 카드
      if (currentSlide === 1 && activeSituation) {
        const board = SITUATION_BOARDS[activeSituation as SituationId];
        return board?.cards[index - 1]?.text || '';
      }
      // 말하기 화면 카드
      const categoryCards = cards[currentCategory] || [];
      return categoryCards[index - 1]?.text || '';
    }

    case 'modal':
      return ''; // ListenerModal이 자체 TTS 처리

    default:
      return '';
  }
}

// ── 화면에 스캔 가능한 항목이 있는지 확인 ──
function isScannableScreen(slide: number): boolean {
  return slide === 0 || slide === 1; // 말하기, 상황만
}

export function useScanning() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── 타이머 관리 ──
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    const { config } = useScanningStore.getState();
    timerRef.current = setInterval(() => {
      moveNext();
    }, config.speed);
  }, [stopTimer]);

  // ── 현재 단계의 항목 수 계산 ──
  const getItemCount = useCallback((): number => {
    const { phase } = useScanningStore.getState();
    const { currentSlide, cards, currentCategory, activeSituation } = useAppStore.getState();

    switch (phase) {
      case 'category':
        if (currentSlide === 1) return SITUATION_IDS.length;
        return DEFAULT_CATEGORIES.length;
      case 'card': {
        if (currentSlide === 1 && activeSituation) {
          const board = SITUATION_BOARDS[activeSituation as SituationId];
          return 1 + (board?.cards.length || 0);
        }
        return 1 + (cards[currentCategory]?.length || 0);
      }
      case 'modal':
        return 1;
      default:
        return 0;
    }
  }, []);

  // ── 다음 항목으로 이동 ──
  const moveNext = useCallback(() => {
    const s = useScanningStore.getState();
    const count = getItemCount();
    if (count === 0) return;

    const nextIndex = (s.currentIndex + 1) % count;

    if (nextIndex === 0) {
      if (s.hasLooped) {
        // 카드 2바퀴 → 카테고리로 복귀
        if (s.phase === 'card') { returnToCategory(); return; }
        // 카테고리 2바퀴 → 그냥 계속 순환 (리셋)
        if (s.phase === 'category') {
          useScanningStore.setState({ hasLooped: false });
        }
      } else {
        useScanningStore.setState({ hasLooped: true });
      }
    }

    useScanningStore.setState({ currentIndex: nextIndex });
    scrollHighlightedIntoView(s.phase, nextIndex);

    // TTS: 항목 이름 읽기
    const label = getItemLabel(s.phase, nextIndex);
    if (label) speakItemName(label);
  }, [getItemCount]);

  // ── 현재 항목 선택 ──
  const selectCurrent = useCallback(() => {
    const s = useScanningStore.getState();
    if (s.currentIndex < 0 || s.currentIndex >= getItemCount()) return;

    if (navigator.vibrate) navigator.vibrate(100);
    stopTimer();
    if ('speechSynthesis' in window) speechSynthesis.cancel();

    switch (s.phase) {
      case 'category': selectCategory(s.currentIndex); break;
      case 'card': selectCard(s.currentIndex); break;
      case 'modal': selectModal(); break;
    }
  }, [getItemCount, stopTimer]);

  // ── 카테고리 선택 ──
  const selectCategory = useCallback((index: number) => {
    const { currentSlide } = useAppStore.getState();

    if (currentSlide === 1) {
      // 상황 화면
      const sitId = SITUATION_IDS[index];
      if (sitId) {
        useAppStore.getState().setActiveSituation(sitId);
        setTimeout(() => enterCardPhase(), 250);
      }
    } else {
      // 말하기 화면
      const cat = DEFAULT_CATEGORIES[index];
      if (cat) {
        useAppStore.getState().setCurrentCategory(cat.id as CategoryId);
        setTimeout(() => enterCardPhase(), 250);
      }
    }
  }, []);

  // ── 카드 선택 ──
  const selectCard = useCallback((index: number) => {
    if (index === 0) { returnToCategory(); return; }

    const { currentSlide } = useAppStore.getState();
    const app = useAppStore.getState();

    let card;
    if (currentSlide === 1 && app.activeSituation) {
      const board = SITUATION_BOARDS[app.activeSituation as SituationId];
      const sitCard = board?.cards[index - 1];
      if (sitCard) card = { ...sitCard, category: 'expression' as const };
    } else {
      const categoryCards = app.cards[app.currentCategory] || [];
      card = categoryCards[index - 1];
    }

    if (card) app.selectCard(card);

    setTimeout(() => {
      const { currentMessage, selectedCards } = useAppStore.getState();
      if (currentMessage) {
        useAppStore.getState().openListenerModal(currentMessage, false, selectedCards);
        setTimeout(() => enterModalPhase(), 500);
      } else {
        resumeCardScan();
      }
    }, 200);
  }, []);

  // ── 모달 선택 (닫기) ──
  const selectModal = useCallback(() => {
    useAppStore.getState().closeListenerModal();
    useAppStore.getState().clearSelection();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    setTimeout(() => resumeCardScan(), 400);
  }, []);

  // ── 단계 전환 ──
  const enterCategoryPhase = useCallback(() => {
    stopTimer();
    useScanningStore.setState({ phase: 'category', currentIndex: 0, hasLooped: false });
    // 첫 항목 TTS
    const label = getItemLabel('category', 0);
    if (label) speakItemName(label);
    setTimeout(() => startTimer(), 100);
  }, [stopTimer, startTimer]);

  const enterCardPhase = useCallback(() => {
    stopTimer();
    useScanningStore.setState({ phase: 'card', currentIndex: 0, hasLooped: false });
    if (getItemCount() <= 1) { returnToCategory(); return; }
    // 첫 항목 TTS
    const label = getItemLabel('card', 0);
    if (label) speakItemName(label);
    setTimeout(() => startTimer(), 100);
  }, [stopTimer, startTimer, getItemCount]);

  const enterModalPhase = useCallback(() => {
    stopTimer();
    // 모달에선 타이머 없음 - 터치로 닫기만
    useScanningStore.setState({ phase: 'modal', currentIndex: 0, hasLooped: false });
  }, [stopTimer]);

  const resumeCardScan = useCallback(() => {
    useScanningStore.setState({ phase: 'card', currentIndex: 0, hasLooped: false });
    const label = getItemLabel('card', 0);
    if (label) speakItemName(label);
    setTimeout(() => startTimer(), 100);
  }, [startTimer]);

  const returnToCategory = useCallback(() => {
    stopTimer();
    const { currentSlide } = useAppStore.getState();
    if (currentSlide === 1) {
      useAppStore.getState().setActiveSituation(null);
    }
    enterCategoryPhase();
  }, [stopTimer, enterCategoryPhase]);

  // ── 화면 이동 (두번터치) ──
  const navigateScreen = useCallback(() => {
    stopTimer();
    if ('speechSynthesis' in window) speechSynthesis.cancel();

    const app = useAppStore.getState();
    // 현재 view가 menu면 app으로 전환
    if (app.currentView !== 'app') {
      app.setCurrentView('app');
    }

    const nextSlide = ((app.currentSlide + 1) % SCREEN_COUNT) as SlideIndex;
    app.setCurrentSlide(nextSlide);

    // 상황 화면에서 나가면 활성 상황 초기화
    if (app.currentSlide === 1) {
      app.setActiveSituation(null);
    }

    if (navigator.vibrate) navigator.vibrate([30, 30, 30]);

    // 화면 이름 TTS
    const screenNames = ['말하기', '상황', '기록', '설정'];
    speakItemName(screenNames[nextSlide]);

    // 스캔 가능한 화면이면 카테고리 스캔 시작
    setTimeout(() => {
      if (isScannableScreen(nextSlide)) {
        enterCategoryPhase();
      } else {
        // 기록/설정: 타이머 정지, 대기 (두번터치로 이동 가능)
        useScanningStore.setState({ phase: 'category', currentIndex: -1, hasLooped: false });
      }
    }, 300);
  }, [stopTimer, enterCategoryPhase]);

  // ── 시작/정지 ──
  const start = useCallback(() => {
    const app = useAppStore.getState();
    document.documentElement.style.setProperty('--scan-color', '#FF6B00');

    // 현재 view가 menu면 app으로 전환
    if (app.currentView !== 'app') {
      app.setCurrentView('app');
    }

    useScanningStore.setState({
      isActive: true, phase: 'category', currentIndex: 0,
      hasLooped: false, selectedMenu: null,
    });

    const slide = app.currentSlide;
    if (isScannableScreen(slide)) {
      // 스캔 가능한 화면: 카테고리 스캔 시작
      const label = getItemLabel('category', 0);
      if (label) speakItemName(label);
      setTimeout(() => startTimer(), 100);
    } else {
      // 기록/설정: 대기 상태
      useScanningStore.setState({ currentIndex: -1 });
    }
  }, [startTimer]);

  const stop = useCallback(() => {
    stopTimer();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    useScanningStore.setState({
      isActive: false, phase: 'category', currentIndex: 0,
      hasLooped: false, selectedMenu: null,
    });
  }, [stopTimer]);

  const restart = useCallback(() => {
    stop();
    setTimeout(() => start(), 150);
  }, [stop, start]);

  // ── 키보드 이벤트 (Enter=선택, ESC=끄기) ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const { isActive } = useScanningStore.getState();
      if (!isActive) return;

      if (e.code === 'Escape') {
        e.preventDefault();
        stop();
        return;
      }

      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        selectCurrent();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectCurrent, stop]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  return { start, stop, restart, moveNext, selectCurrent, navigateScreen };
}

// ── 유틸: 하이라이트 요소 스크롤 ──
function scrollHighlightedIntoView(phase: string, index: number) {
  requestAnimationFrame(() => {
    const el = document.querySelector(
      `[data-scan-phase="${phase}"][data-scan-index="${index}"]`,
    );
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  });
}

// ── 헬퍼 훅: 컴포넌트에서 하이라이트 여부 확인 ──
export function useScanHighlight(phase: string, index: number): boolean {
  const isActive = useScanningStore((s) => s.isActive);
  const currentPhase = useScanningStore((s) => s.phase);
  const currentIndex = useScanningStore((s) => s.currentIndex);
  return isActive && currentPhase === phase && currentIndex === index;
}
