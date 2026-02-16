// ========================================
// useScanning.ts - 스캐닝 모드 핵심 로직
// 출처: legacy/js/modules/scanning.js (925 LOC)
//
// 흐름: menu → category → card → modal
//   · 자동 모드: 타이머로 자동 이동, 입력 = 선택
//   · 단계별 모드: Space=다음, Enter=선택
//   · 2바퀴 순환 시 이전 단계 자동 복귀
//   · TTS: 하이라이트 이동 시 항목 이름 읽기
//   · 취소: 터치 오버레이 취소 버튼으로 이전 단계 복귀
// ========================================

import { useEffect, useCallback, useRef } from 'react';
import { useScanningStore } from '../store/useScanningStore';
import type { ScanPhase } from '../store/useScanningStore';
import { useAppStore } from '../store/useAppStore';
import { DEFAULT_CATEGORIES } from '../data/cards';
import { SITUATION_BOARDS } from '../data/cards';
import type { SituationId, CategoryId } from '../types';

const SITUATION_IDS = Object.keys(SITUATION_BOARDS) as SituationId[];

// ── TTS: 항목 이름 읽기 ──
function speakItemName(text: string) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = 1.2; // 스캐닝 중에는 약간 빠르게
  u.volume = 0.7;
  speechSynthesis.speak(u);
}

// ── 현재 하이라이트된 항목의 이름 가져오기 ──
function getItemLabel(phase: ScanPhase, index: number): string {
  const { selectedMenu } = useScanningStore.getState();
  const { cards, currentCategory, activeSituation } = useAppStore.getState();

  switch (phase) {
    case 'menu':
      return index === 0 ? '말하기' : '상황';

    case 'category':
      if (selectedMenu === 'situation') {
        const sitId = SITUATION_IDS[index];
        return sitId ? SITUATION_BOARDS[sitId].name : '';
      }
      return DEFAULT_CATEGORIES[index]?.name || '';

    case 'card': {
      if (index === 0) return '돌아가기';
      if (selectedMenu === 'situation' && activeSituation) {
        const board = SITUATION_BOARDS[activeSituation as SituationId];
        return board?.cards[index - 1]?.text || '';
      }
      const categoryCards = cards[currentCategory] || [];
      return categoryCards[index - 1]?.text || '';
    }

    case 'modal':
      return '닫기';

    default:
      return '';
  }
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
    const { phase, selectedMenu } = useScanningStore.getState();
    const { cards, currentCategory, activeSituation } = useAppStore.getState();

    switch (phase) {
      case 'menu':
        return 2;
      case 'category':
        return selectedMenu === 'situation'
          ? SITUATION_IDS.length
          : DEFAULT_CATEGORIES.length;
      case 'card': {
        if (selectedMenu === 'situation' && activeSituation) {
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
        if (s.phase === 'card') { returnToCategory(); return; }
        if (s.phase === 'category') { returnToMenu(); return; }
      }
      useScanningStore.setState({ hasLooped: true });
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
      case 'menu': selectMenu(s.currentIndex); break;
      case 'category': selectCategory(s.currentIndex); break;
      case 'card': selectCard(s.currentIndex); break;
      case 'modal': selectModal(); break;
    }
  }, [getItemCount, stopTimer]);

  // ── 취소 (이전 단계로 복귀) ──
  const goBack = useCallback(() => {
    stopTimer();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const { phase } = useScanningStore.getState();

    switch (phase) {
      case 'card': returnToCategory(); break;
      case 'category': returnToMenu(); break;
      case 'modal': {
        // 모달 닫고 카드 스캔 재개
        useAppStore.getState().closeListenerModal();
        useAppStore.getState().clearSelection();
        if ('speechSynthesis' in window) speechSynthesis.cancel();
        setTimeout(() => resumeCardScan(), 400);
        break;
      }
      default: break; // 메뉴 단계에서는 취소 불가 (최상위)
    }
  }, [stopTimer]);

  // ── 메뉴 선택 ──
  const selectMenu = useCallback((index: number) => {
    const menu = index === 0 ? 'speak' : 'situation';
    useScanningStore.setState({ selectedMenu: menu });
    useAppStore.getState().setCurrentView('app');
    useAppStore.getState().setCurrentSlide(menu === 'speak' ? 0 : 1);

    setTimeout(() => enterCategoryPhase(), 300);
  }, []);

  // ── 카테고리 선택 ──
  const selectCategory = useCallback((index: number) => {
    const { selectedMenu } = useScanningStore.getState();

    if (selectedMenu === 'situation') {
      const sitId = SITUATION_IDS[index];
      if (sitId) {
        useAppStore.getState().setActiveSituation(sitId);
        setTimeout(() => enterCardPhase(), 250);
      }
    } else {
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

    const { selectedMenu } = useScanningStore.getState();
    const app = useAppStore.getState();

    let card;
    if (selectedMenu === 'situation' && app.activeSituation) {
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
  const beginAutoScan = useCallback(() => {
    const { config } = useScanningStore.getState();
    if (config.method === 'auto') {
      setTimeout(() => startTimer(), 100);
    }
    // 첫 항목 TTS
    const { phase } = useScanningStore.getState();
    const label = getItemLabel(phase, 0);
    if (label) speakItemName(label);
  }, [startTimer]);

  const enterCategoryPhase = useCallback(() => {
    stopTimer();
    useScanningStore.setState({ phase: 'category', currentIndex: 0, hasLooped: false });
    beginAutoScan();
  }, [stopTimer, beginAutoScan]);

  const enterCardPhase = useCallback(() => {
    stopTimer();
    useScanningStore.setState({ phase: 'card', currentIndex: 0, hasLooped: false });
    if (getItemCount() <= 1) { returnToCategory(); return; }
    beginAutoScan();
  }, [stopTimer, beginAutoScan, getItemCount]);

  const enterModalPhase = useCallback(() => {
    stopTimer();
    useScanningStore.setState({ phase: 'modal', currentIndex: 0, hasLooped: false });
    beginAutoScan();
  }, [stopTimer, beginAutoScan]);

  const resumeCardScan = useCallback(() => {
    useScanningStore.setState({ phase: 'card', currentIndex: 0, hasLooped: false });
    beginAutoScan();
  }, [beginAutoScan]);

  const returnToCategory = useCallback(() => {
    stopTimer();
    const { selectedMenu } = useScanningStore.getState();
    if (selectedMenu === 'situation') {
      useAppStore.getState().setActiveSituation(null);
    }
    enterCategoryPhase();
  }, [stopTimer, enterCategoryPhase]);

  const returnToMenu = useCallback(() => {
    stopTimer();
    useScanningStore.setState({ selectedMenu: null });
    useAppStore.getState().setCurrentView('menu');
    useScanningStore.setState({ phase: 'menu', currentIndex: 0, hasLooped: false });
    beginAutoScan();
  }, [stopTimer, beginAutoScan]);

  // ── 시작/정지 ──
  const start = useCallback(() => {
    useAppStore.getState().setCurrentView('menu');
    document.documentElement.style.setProperty(
      '--scan-color',
      useScanningStore.getState().config.highlightColor,
    );
    useScanningStore.setState({
      isActive: true, phase: 'menu', currentIndex: 0,
      hasLooped: false, selectedMenu: null,
    });
    beginAutoScan();
  }, [beginAutoScan]);

  const stop = useCallback(() => {
    stopTimer();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    useScanningStore.setState({
      isActive: false, phase: 'menu', currentIndex: 0,
      hasLooped: false, selectedMenu: null,
    });
  }, [stopTimer]);

  const restart = useCallback(() => {
    stop();
    setTimeout(() => start(), 150);
  }, [stop, start]);

  // ── 키보드 이벤트 (Space/Enter + ESC 취소) ──
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const { isActive, config } = useScanningStore.getState();
      if (!isActive) return;

      // ESC → 취소 (이전 단계로)
      if (e.code === 'Escape') {
        e.preventDefault();
        goBack();
        return;
      }

      if (e.code !== 'Space' && e.code !== 'Enter') return;
      e.preventDefault();

      if (config.method === 'step') {
        e.code === 'Space' ? moveNext() : selectCurrent();
      } else {
        selectCurrent();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [moveNext, selectCurrent, goBack]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  return { start, stop, restart, moveNext, selectCurrent, goBack };
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
