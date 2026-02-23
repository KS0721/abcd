// ========================================
// useSwipeGesture.ts - 슬라이드 스와이프 제스처
// 카드 그리드 영역에서만 스와이프 허용
// (긴급바, 카테고리바 터치 시 페이지 넘김 방지)
// ========================================

import { useRef, useCallback } from 'react';
import type { SlideIndex } from '../types';
import { useAppStore } from '../store/useAppStore';

const SWIPE_THRESHOLD = 50;
const MAX_SLIDES = 4;

/** 터치 시작 지점이 스와이프 금지 영역인지 확인 */
function isNoSwipeZone(target: EventTarget | null): boolean {
  let el = target as HTMLElement | null;
  while (el) {
    if (el.dataset?.noSwipe !== undefined) return true;
    el = el.parentElement;
  }
  return false;
}

export function useSwipeGesture() {
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // 긴급바, 카테고리바 등에서 시작된 터치는 스와이프 무시
    if (isNoSwipeZone(e.target)) {
      touchStart.current = null;
      return;
    }

    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.time;
    touchStart.current = null;

    // 수직 스와이프 무시, 너무 느린 스와이프 무시
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dt > 500) return;

    const { currentSlide, setCurrentSlide } = useAppStore.getState();

    if (dx < 0 && currentSlide < MAX_SLIDES - 1) {
      setCurrentSlide((currentSlide + 1) as SlideIndex);
    } else if (dx > 0 && currentSlide > 0) {
      setCurrentSlide((currentSlide - 1) as SlideIndex);
    }
  }, []);

  return { handleTouchStart, handleTouchEnd };
}
