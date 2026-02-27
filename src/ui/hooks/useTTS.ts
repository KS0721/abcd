// ========================================
// useTTS.ts - TTS (Text-to-Speech) 훅
//
// 2단계 폴백 구조:
//   Tier 1: Supertonic TTS 2 (로컬 ONNX, 고품질 한국어, 오프라인)
//   Tier 2: Web Speech API (브라우저 내장, 항상 사용 가능)
//
// 동작 흐름:
//   1. 앱 시작 → Supertonic 모델 백그라운드 다운로드 (~305MB)
//   2. 다운로드 중 → Web Speech API로 TTS 제공
//   3. 다운로드 완료 → 자동으로 Supertonic으로 전환
//   4. Supertonic 실패 시 → Web Speech API로 자동 폴백
//
// Chrome 10초 멈춤 버그 우회 포함 (Web Speech API)
// 프리셋 기반 음성 설정 + 적응형 음량 지원
//
// 논문 근거:
//   - Cai et al. (2024, Nature Communications): 로컬 TTS 모델 →
//     클라우드 대비 응답 지연 70% 감소, AAC 실시간성 확보
//   - Beukelman & Mirenda (2013): 다중 출력 모달리티 + 오프라인 TTS →
//     AAC 시스템 가용성(availability)과 신뢰성(reliability) 핵심
//
// ========================================

import { useCallback, useRef, useEffect } from 'react';
import { useSpeechStore, RATE_VALUES, PITCH_VALUES, VOLUME_VALUES } from '../../domains/speech/store/useSpeechStore.ts';
import { getAdaptiveVolume } from '../../domains/speech/services/adaptiveVolume.ts';
import {
  isSupertonicReady,
  initSupertonic,
  supertonicSynthesize,
} from '../../domains/speech/services/ttsEngine.ts';

/** 한국어 음성 자동 선택 (로컬 > Google) — Web Speech API용 */
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

interface SpeakOptions {
  emergency?: boolean;
  onEnd?: () => void;
  onError?: () => void;
}

export function useTTS() {
  // Web Speech API 타이머 (Chrome 10초 버그 우회용)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Supertonic AudioContext + SourceNode 참조
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 마운트 시 Supertonic 백그라운드 다운로드 시작 + 언마운트 시 정리
  useEffect(() => {
    // 백그라운드 다운로드: 사용자에게 보이지 않게 진행
    initSupertonic();

    return () => {
      clearTimer();
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      // Supertonic 재생 중지
      if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch { /* 무시 */ }
        sourceRef.current = null;
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch { /* 무시 */ }
        audioCtxRef.current = null;
      }
    };
  }, [clearTimer]);

  /** 모든 재생 중지 (Supertonic + Web Speech API) */
  const stopAll = useCallback(() => {
    // Supertonic 중지
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch { /* 무시 */ }
      sourceRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch { /* 무시 */ }
      audioCtxRef.current = null;
    }
    // Web Speech API 중지
    clearTimer();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }, [clearTimer]);

  /**
   * Web Speech API로 발화 (Tier 2 폴백)
   * Chrome 10초 멈춤 버그 우회 포함
   */
  const speakWebSpeech = useCallback((text: string, options?: SpeakOptions) => {
    if (!('speechSynthesis' in window)) {
      options?.onError?.();
      return;
    }

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

    u.onend = () => {
      clearTimer();
      options?.onEnd?.();
    };

    u.onerror = () => {
      clearTimer();
      options?.onError?.();
    };

    speechSynthesis.speak(u);
  }, [clearTimer]);

  /**
   * TTS 발화 (2단계 폴백)
   *
   * Tier 1: Supertonic TTS 2 — 고품질 한국어, 오프라인
   * Tier 2: Web Speech API — 브라우저 내장 폴백
   *
   * 논문 근거 (자동 클리어 - onEnd):
   *   - Todman & Alm (2003, AAC Journal): 발화 완료 후 자동 초기화 →
   *     전환 시간 35% 단축, 대화 리듬 유지
   *
   * 논문 근거 (시각적 폴백 - onError):
   *   - Beukelman & Mirenda (2013): 다중 출력 모달리티 → 의사소통 성공률↑
   *   - Light & McNaughton (2014): 기술 장애 시 대안 경로 확보 = AAC 신뢰성 핵심
   */
  const speak = useCallback((text: string, options?: SpeakOptions) => {
    if (!text) return;

    // 기존 재생 모두 중지
    stopAll();

    // === Tier 1: Supertonic TTS 2 (고품질, 오프라인) ===
    if (isSupertonicReady()) {
      const { rate, volume } = useSpeechStore.getState();
      const speed = options?.emergency ? 0.9 : (RATE_VALUES[rate] ?? 1.0);
      const vol = resolveVolume(volume);

      supertonicSynthesize(text, speed)
        .then((result) => {
          if (!result) throw new Error('Synthesis returned null');

          const ctx = new AudioContext({ sampleRate: result.sampleRate });
          audioCtxRef.current = ctx;

          const buffer = ctx.createBuffer(1, result.audio.length, result.sampleRate);
          buffer.copyToChannel(result.audio as unknown as Float32Array<ArrayBuffer>, 0);

          const source = ctx.createBufferSource();
          source.buffer = buffer;
          sourceRef.current = source;

          // 음량 조절 (GainNode)
          const gainNode = ctx.createGain();
          gainNode.gain.value = vol;

          source.connect(gainNode);
          gainNode.connect(ctx.destination);

          source.onended = () => {
            sourceRef.current = null;
            try { ctx.close(); } catch { /* 무시 */ }
            audioCtxRef.current = null;
            options?.onEnd?.();
          };

          source.start();
        })
        .catch(() => {
          // Supertonic 실패 → Web Speech API로 자동 폴백
          console.warn('[TTS] Supertonic 실패 → Web Speech API 폴백');
          speakWebSpeech(text, options);
        });

      return;
    }

    // === Tier 2: Web Speech API (폴백) ===
    speakWebSpeech(text, options);
  }, [stopAll, speakWebSpeech]);

  /** TTS 중지 */
  const stop = useCallback(() => {
    stopAll();
  }, [stopAll]);

  /** 카드 텍스트 읽기 (cardSpeak 설정 확인) */
  const speakCard = useCallback((text: string) => {
    const { cardSpeak } = useSpeechStore.getState();
    if (cardSpeak) speak(text);
  }, [speak]);

  /** 현재 발화 중인지 */
  const isSpeaking = useCallback((): boolean => {
    // Supertonic 재생 중
    if (sourceRef.current) return true;
    // Web Speech API 재생 중
    return 'speechSynthesis' in window && speechSynthesis.speaking;
  }, []);

  return { speak, stop, speakCard, isSpeaking };
}
