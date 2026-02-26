// ========================================
// 음성 합성 도메인 Barrel Export
// ========================================

// 모델
export type { SpeechPreset, SpeechSettings } from './models.ts';

// 서비스
export {
  isSupertonicReady,
  getSupertonicProgress,
  isSupertonicLoading,
  initSupertonic,
  supertonicSynthesize,
  getAdaptiveVolume,
  requestMicPermission,
} from './services/index.ts';

// 스토어
export { useSpeechStore, RATE_VALUES, PITCH_VALUES, VOLUME_VALUES } from './store/index.ts';
