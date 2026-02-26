// ========================================
// useTTS.ts - TTS (Text-to-Speech) 훅
// Chrome 10초 멈춤 버그 우회 포함
// 프리셋 기반 음성 설정 + 적응형 음량 지원
// ========================================

import { useCallback, useRef, useEffect } from 'react';
import { useSpeechStore, RATE_VALUES, PITCH_VALUES, VOLUME_VALUES } from '../store/useSpeechStore';
import { getAdaptiveVolume } from '../lib/adaptiveVolume';

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

/** 프리셋에서 실제 음량 값 계산 */
function resolveVolume(preset: string): number {
  const mapped = VOLUME_VALUES[preset as keyof typeof VOLUME_VALUES] ?? 1.0;
  if (mapped < 0) {
    // adaptive: 주변 소음 기반 음량
    return getAdaptiveVolume();
  }
  return mapped;
}

export function useTTS() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    u.rate = options?.emergency ? 0.9 : (RATE_VALUES[rate] ?? 1.0);
    u.pitch = PITCH_VALUES[pitch] ?? 1.0;
    u.volume = resolveVolume(volume);

    const voice = findKoreanVoice();
    if (voice) u.voice = voice;

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
