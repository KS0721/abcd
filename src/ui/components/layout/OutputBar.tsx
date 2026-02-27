// ========================================
// OutputBar.tsx - 출력 바 (문장 표시 + 말하기/보여주기/지우기)
//
// 버튼 역할:
//   스피커 = 크게보기 + 말하기 (이미지+텍스트 표시 + TTS)
//   눈     = 크게보기만 (이미지+텍스트 표시, 말하기 없음)
//   휴지통 = 되돌리기 (탭: 1개 제거, 길게: 전체 지우기)
// ========================================

import { useCallback, useRef } from 'react';
import { useSentenceStore } from '../../../domains/sentence/store/useSentenceStore.ts';
import { useUIStore } from '../../store/useUIStore.ts';
import { useUserDataStore } from '../../../domains/user-data/store/useUserDataStore.ts';
import styles from '../../styles/OutputBar.module.css';

export default function OutputBar() {
  const currentMessage = useSentenceStore((s) => s.currentMessage);
  const selectedCards = useSentenceStore((s) => s.selectedCards);
  const clearSelection = useSentenceStore((s) => s.clearSelection);
  const deselectCard = useSentenceStore((s) => s.deselectCard);
  const openListenerModal = useUIStore((s) => s.openListenerModal);
  const addToHistory = useUserDataStore((s) => s.addToHistory);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const hasMessage = currentMessage.length > 0;

  // 스피커 버튼: 크게보기 + 말하기
  const handleSpeakAndShow = useCallback(() => {
    if (!hasMessage) return;
    addToHistory(currentMessage);
    if (navigator.vibrate) navigator.vibrate(50);
    openListenerModal(currentMessage, false, selectedCards, true);
  }, [currentMessage, hasMessage, selectedCards, addToHistory, openListenerModal]);

  // 눈 버튼: 크게보기만 (말하기 없음)
  const handleShowOnly = useCallback(() => {
    if (!hasMessage) return;
    openListenerModal(currentMessage, false, selectedCards, false);
  }, [currentMessage, hasMessage, selectedCards, openListenerModal]);

  // 되돌리기: 탭 = 마지막 카드 1개 제거, 길게 누르기(1초) = 전체 지우기
  const handleUndoPointerDown = useCallback(() => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      clearSelection();
      if (navigator.vibrate) navigator.vibrate(100);
    }, 1000);
  }, [clearSelection]);

  const handleUndoPointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!didLongPress.current && selectedCards.length > 0) {
      // 탭: 마지막 카드 1개 제거
      const lastCard = selectedCards[selectedCards.length - 1];
      // 햅틱 피드백: 되돌리기 = [10,30,10] (짧-긴-짧 패턴으로 '제거' 느낌)
      // 논문: Hoggan et al. (2008, MobileHCI): 동작별 햅틱 차별화 → 오류율 18% 감소
      if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
      deselectCard(lastCard.id);
    }
  }, [selectedCards, deselectCard]);

  return (
    <div className={styles.bar}>
      <div className={styles.textArea} aria-live="polite" aria-atomic="true" aria-label="현재 문장">
        {hasMessage ? (
          <span className={styles.text}>{currentMessage}</span>
        ) : (
          <span className={`${styles.text} ${styles.empty}`}>카드를 선택하세요</span>
        )}
      </div>

      <div className={styles.buttons}>
        <button
          className={styles.btnSpeak}
          onClick={handleSpeakAndShow}
          disabled={!hasMessage}
          aria-label="크게보기 + 말하기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </button>

        <button
          className={styles.btnShow}
          onClick={handleShowOnly}
          disabled={!hasMessage}
          aria-label="크게보기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>

        <button
          className={styles.btnClear}
          onPointerDown={handleUndoPointerDown}
          onPointerUp={handleUndoPointerUp}
          onPointerLeave={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
          aria-label="되돌리기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  );
}
