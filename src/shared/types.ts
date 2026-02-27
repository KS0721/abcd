// ========================================
// 공통 UI 타입 (특정 도메인에 속하지 않는 타입)
// ========================================

import type { Card } from '../domains/card/models.ts';

// 뷰 타입
export type AppView = 'app';
export type SlideIndex = 0 | 1 | 2 | 3 | 4; // 말하기(0), 상황(1), 기록(2), 빠른문장(3), 설정(4)

// 앱 설정
// gridSize: Light & McNaughton (2014) - 사용자 운동 능력에 따라 그리드 크기 조절 필수
export type GridSize = '2x2' | '3x3' | '4x4' | '5x5' | '6x6';

export interface Settings {
  highContrast: boolean;
  darkMode: boolean;
  fontSize: 'medium' | 'large' | 'xlarge';
  vibration: boolean;
  gridSize: GridSize;
  // 길게 누르기 시간 (ms): 0 = 즉시 선택, 100~1000 = 누르고 있어야 선택
  // 논문: Fager et al. (2019, PMC6436971) - 운동장애 사용자 오선택 방지
  dwellTime: number;
  // 상대방 듣기 (STT): 켜면 헤더에 마이크 버튼 표시
  sttEnabled: boolean;
}

// 모달 상태
export interface ListenerModalState {
  isOpen: boolean;
  message: string;
  isEmergency: boolean;
  cards: Card[];
  withSpeech: boolean;
}

export interface ConfirmModalState {
  isOpen: boolean;
  message: string;
  resolve: ((value: boolean) => void) | null;
}

export interface AddCardModalState {
  isOpen: boolean;
  category: string | null;
}

export interface EditCardModalState {
  isOpen: boolean;
  card: Card | null;
  category: string | null;
}
