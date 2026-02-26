// ========================================
// OutputBar.tsx - 출력 바 (문장 표시 + 말하기/보여주기/지우기)
//
// 🤖 AI TODO [TTS + STT 통합 + 문장 교정 - AI 통합 지점 #5]
// ──────────────────────────────────────────────────────────
//
// ■ 역할 1: 문장 자동 교정 (발화 전)
//   사용자가 카드를 선택하여 만든 문장이 부자연스러울 때,
//   LLM이 자연스러운 한국어로 교정하여 "교정된 문장"을 제안
//   → 사용자가 원문/교정문 중 선택하여 발화
//
//   입력: currentMessage (카드 조합으로 만든 원문)
//   처리: LLM이 조사, 어순, 높임말 교정
//   출력: correctedMessage + 교정 이유
//
//   LLM 프롬프트 예시:
//   ```
//   다음은 AAC 카드 조합으로 생성된 문장입니다: "{currentMessage}"
//   이 문장을 자연스러운 한국어 존댓말로 교정하세요.
//   원문이 이미 자연스러우면 그대로 반환하세요.
//   JSON: {"corrected": "교정된 문장", "changed": true/false, "reason": "교정 이유"}
//   ```
//
// ■ 역할 2: STT (Speech-to-Text) 상대방 말 인식
//   사용자가 TTS로 발화한 후, 상대방의 음성 응답을 인식하여
//   대화 문맥을 LLM에게 전달 → 다음 카드 추천에 반영
//
//   흐름:
//   1. 사용자 [말하기] 버튼 → TTS 발화
//   2. TTS 완료 후 → Web Speech API의 SpeechRecognition 자동 시작
//   3. 상대방 음성 인식 → sttResult 상태에 저장
//   4. LLM에게 전달: {userSaid: currentMessage, partnerSaid: sttResult}
//   5. LLM이 대화 문맥 분석 → 다음 추천 카드 갱신 (SuggestionBar로)
//
//   구현 코드 스케치:
//   ```typescript
//   const handleSpeak = async () => {
//     addToHistory(currentMessage);
//     await speakTTS(currentMessage);          // TTS 발화
//     const partnerSaid = await listenSTT();   // STT 시작 (5초 타임아웃)
//     if (partnerSaid) {
//       const suggestions = await llm.getNextCards({
//         userSaid: currentMessage,
//         partnerSaid,
//         history,
//       });
//       setSuggestions(suggestions);            // SuggestionBar 갱신
//     }
//   };
//   ```
//
// ■ 역할 3: 발화 후 자동 클리어 옵션
//   LLM이 문장 발화 후 "이 대화는 끝났다"고 판단하면 자동 클리어
//   예) "감사합니다" → 대화 종료로 판단 → 자동 클리어 + 새 대화 준비
//
// ■ 논문 근거:
//   - Cai et al. (2024, Nature Communications): LLM + STT 결합 → ALS 환자 소통 효율 57% 증가
//   - Kristensson & Vertanen (2012, ASSETS): 운동장애인 대상 음성 인식 + 텍스트 예측 결합
//   - Higginbotham & Wilkins (1999): AAC 대화 이력 활용 → 반복 발화 속도 50% 향상
//   - Valencia et al. (2023, CHI): 대화 턴 문맥을 활용한 AAC 응답 생성
// ========================================

import { useCallback, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTTS } from '../../hooks/useTTS';
import styles from '../../styles/OutputBar.module.css';

export default function OutputBar() {
  const currentMessage = useAppStore((s) => s.currentMessage);
  const selectedCards = useAppStore((s) => s.selectedCards);
  const clearSelection = useAppStore((s) => s.clearSelection);
  const deselectCard = useAppStore((s) => s.deselectCard);
  const openListenerModal = useAppStore((s) => s.openListenerModal);
  const addToHistory = useAppStore((s) => s.addToHistory);
  const { speak } = useTTS();
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const hasMessage = currentMessage.length > 0;

  const handleSpeak = useCallback(() => {
    if (!hasMessage) return;
    addToHistory(currentMessage);
    // 🤖 AI TODO [STT 통합]: TTS 발화 후 상대방 말을 인식하여 대화 문맥 파악
    // - 논문: Cai et al. (2024, Nature Communications) - LLM + STT 결합 시 ALS 환자 타이핑 57% 감소
    speak(currentMessage);
  }, [currentMessage, hasMessage, addToHistory, speak]);

  const handleShow = useCallback(() => {
    if (!hasMessage) return;
    openListenerModal(currentMessage, false, selectedCards);
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
      deselectCard(lastCard.id);
    }
  }, [selectedCards, deselectCard]);

  return (
    <div className={styles.bar}>
      <div className={styles.textArea} aria-live="polite" aria-atomic="true">
        {hasMessage ? (
          <span className={styles.text}>{currentMessage}</span>
        ) : (
          <span className={`${styles.text} ${styles.empty}`}>카드를 선택하세요</span>
        )}
      </div>

      <div className={styles.buttons}>
        <button
          className={styles.btnSpeak}
          onClick={handleSpeak}
          disabled={!hasMessage}
          aria-label="말하기"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </button>

        <button
          className={styles.btnShow}
          onClick={handleShow}
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
