// ========================================
// useDragDrop.ts - 편집 모드 카드 드래그 재배치
// 출처: legacy/js/modules/dragDrop.js
// ========================================

import { useRef, useCallback } from 'react';
import type { CategoryId } from '../types';
import { useAppStore } from '../store/useAppStore';

interface DragState {
  dragIndex: number | null;
  overIndex: number | null;
}

export function useDragDrop(category: CategoryId) {
  const stateRef = useRef<DragState>({ dragIndex: null, overIndex: null });

  const handleDragStart = useCallback((index: number) => {
    stateRef.current.dragIndex = index;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    stateRef.current.overIndex = index;
  }, []);

  const handleDrop = useCallback(() => {
    const { dragIndex, overIndex } = stateRef.current;
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex) {
      useAppStore.getState().reorderCards(category, dragIndex, overIndex);
    }
    stateRef.current = { dragIndex: null, overIndex: null };
  }, [category]);

  const handleDragEnd = useCallback(() => {
    stateRef.current = { dragIndex: null, overIndex: null };
  }, []);

  // 터치 드래그 (모바일)
  const touchRef = useRef<{
    startY: number;
    el: HTMLElement | null;
    index: number;
    moved: boolean;
  } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent, index: number) => {
    const touch = e.touches[0];
    touchRef.current = {
      startY: touch.clientY,
      el: e.currentTarget as HTMLElement,
      index,
      moved: false,
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const touch = e.touches[0];
    const dy = Math.abs(touch.clientY - touchRef.current.startY);
    if (dy > 10) touchRef.current.moved = true;
  }, []);

  const handleTouchEnd = useCallback((_e: React.TouchEvent, targetIndex: number) => {
    if (!touchRef.current || !touchRef.current.moved) {
      touchRef.current = null;
      return;
    }

    const fromIndex = touchRef.current.index;
    if (fromIndex !== targetIndex) {
      useAppStore.getState().reorderCards(category, fromIndex, targetIndex);
    }
    touchRef.current = null;
  }, [category]);

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
