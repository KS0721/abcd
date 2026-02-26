// ========================================
// 음성 합성 서비스 Barrel Export
// ========================================

// TTS 엔진
export {
  isSupertonicReady,
  getSupertonicProgress,
  isSupertonicLoading,
  initSupertonic,
  supertonicSynthesize,
} from './ttsEngine.ts';

// 적응형 음량
export {
  getAdaptiveVolume,
  requestMicPermission,
} from './adaptiveVolume.ts';
