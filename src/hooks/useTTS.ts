// ========================================
// useTTS.ts - TTS (Text-to-Speech) 훅
// Chrome 10초 멈춤 버그 우회 포함
// 출처: legacy/js/modules/tts.js
// ========================================

import { useCallback, useRef, useEffect } from 'react';
import { useSpeechStore } from '../store/useSpeechStore';

/** 한국어 음성 자동 선택 (로컬 > Google) */
function findKoreanVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = speechSynthesis.getVoices();
  // 로컬 음성 우선
  const local = voices.find((v) => v.lang.startsWith('ko') && v.localService);
  if (local) return local;
  // Google 음성
  const google = voices.find((v) => v.lang.startsWith('ko') && v.name.includes('Google'));
  if (google) return google;
  // 아무 한국어 음성
  return voices.find((v) => v.lang.startsWith('ko')) || null;
}

export function useTTS() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      clearTimer();
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    };
  }, [clearTimer]);

  /** TTS 발화 */
  const speak = useCallback((text: string, options?: { emergency?: boolean }) => {
    if (!('speechSynthesis' in window) || !text) return;

    const { rate, pitch, volume } = useSpeechStore.getState();

    speechSynthesis.cancel();
    clearTimer();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    u.rate = options?.emergency ? 0.9 : rate;
    u.pitch = pitch;
    u.volume = volume;

    const voice = findKoreanVoice();
    if (voice) u.voice = voice;

    utteranceRef.current = u;

    // Chrome 10초 멈춤 버그 우회: 긴 텍스트일 때 주기적 pause/resume
    u.onstart = () => {
      if (text.length > 20) {
        timerRef.current = setInterval(() => {
          if (speechSynthesis.speaking && !speechSynthesis.paused) {
            speechSynthesis.pause();
            speechSynthesis.resume();
          }
        }, 8000);
      }
    };

    u.onend = () => clearTimer();
    u.onerror = () => clearTimer();

    speechSynthesis.speak(u);
  }, [clearTimer]);

  /** TTS 중지 */
  const stop = useCallback(() => {
    clearTimer();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }, [clearTimer]);

  /** 카드 텍스트 읽기 (cardSpeak 설정 확인) */
  const speakCard = useCallback((text: string) => {
    const { cardSpeak } = useSpeechStore.getState();
    if (cardSpeak) speak(text);
  }, [speak]);

  /** 현재 발화 중인지 */
  const isSpeaking = useCallback((): boolean => {
    return 'speechSynthesis' in window && speechSynthesis.speaking;
  }, []);

  return { speak, stop, speakCard, isSpeaking };
}
