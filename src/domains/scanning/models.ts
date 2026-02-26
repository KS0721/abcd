// ========================================
// 스캐닝 접근성 도메인 모델
// ========================================

// 스캐닝 설정 (자동 모드 전용, 3초 고정)
export interface ScanningConfig {
  speed: number;
}

// 스캐닝 단계
export type ScanPhase = 'menu' | 'category' | 'card' | 'modal';
