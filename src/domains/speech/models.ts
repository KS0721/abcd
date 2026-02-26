// ========================================
// 음성 합성 도메인 모델
// ========================================

// 음성 프리셋
export type SpeechPreset = 'auto' | 'small' | 'medium' | 'large';

// 음성 설정
export interface SpeechSettings {
  rate: SpeechPreset;
  pitch: SpeechPreset;
  volume: SpeechPreset;
  voiceName: string;
  cardSpeak: boolean;
  repeatOnShow: boolean;
}
