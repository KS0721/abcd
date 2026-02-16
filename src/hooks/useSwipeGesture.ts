// ========================================
// useSwipeGesture.ts - 슬라이드 스와이프 제스처
// 출처: legacy/js/modules/swiper.js
// ========================================

import { useRef, useCallback } from 'react';
import type { SlideIndex } from '../types';
import { useAppStore } from '../store/useAppStore';

const SWIPE_THRESHOLD = 50; // 최소 스와이프 거리 (px)
const MAX_SLIDES = 4;       // 슬라이드 수 (0~3)

export function useSwipeGesture() {
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
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
      // 왼쪽 스와이프 → 다음 슬라이드
      setCurrentSlide((currentSlide + 1) as SlideIndex);
    } else if (dx > 0 && currentSlide > 0) {
      // 오른쪽 스와이프 → 이전 슬라이드
      setCurrentSlide((currentSlide - 1) as SlideIndex);
    }
  }, []);

  return { handleTouchStart, handleTouchEnd };
}
