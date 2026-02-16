// ========================================
// AAC 앱 타입 정의
// ========================================

// 카테고리 ID
export type CategoryId =
  | 'person' | 'action' | 'feeling' | 'food'
  | 'place' | 'thing' | 'time' | 'expression';

// 카드 인터페이스
export interface Card {
  id: string;
  text: string;
  category: CategoryId | 'emergency';
  arasaacKeyword?: string;
  pictogramId?: number;     // ARASAAC 픽토그램 ID 직접 지정 (키워드 검색 우회)
  pictogramUrl?: string;    // 외부 이미지 URL 또는 data: URI (최우선)
  grammarType?: 'verb' | 'noun' | 'adjective' | 'adverb' | 'pronoun' | 'particle' | 'question' | 'request' | 'social' | 'emergency';
  photoData?: string;
  isUserCard?: boolean;
  emergency?: boolean;
}

// 카테고리 정의
export interface Category {
  id: CategoryId;
  name: string;
}

// 상황판 카드
export interface SituationCard {
  id: string;
  text: string;
  arasaacKeyword: string;
}

// 상황판
export interface SituationBoard {
  name: string;
  emoji: string;
  cards: SituationCard[];
}

export type SituationId =
  | 'home' | 'hospital' | 'restaurant' | 'school'
  | 'daycare' | 'car' | 'park' | 'mart' | 'bath';

// 동사 추천 매핑
export type VerbSuggestions = Record<string, string[]>;

// 앱 설정
export interface Settings {
  highContrast: boolean;
  darkMode: boolean;
  fontSize: 'medium' | 'large' | 'xlarge';
  vibration: boolean;
}

// 음성 설정
export interface SpeechSettings {
  rate: number;
  pitch: number;
  volume: number;
  voiceName: string;
  cardSpeak: boolean;
  repeatOnShow: boolean;
}

// 스캐닝 설정
export interface ScanningConfig {
  speed: number;
  method: 'auto' | 'step';
  highlightColor: string;
}

// 뷰 타입
export type AppView = 'splash' | 'menu' | 'app';
export type SlideIndex = 0 | 1 | 2 | 3;

// 모달 상태
export interface ListenerModalState {
  isOpen: boolean;
  message: string;
  isEmergency: boolean;
  cards: Card[];
}

export interface ConfirmModalState {
  isOpen: boolean;
  message: string;
  resolve: ((value: boolean) => void) | null;
}

export interface AddCardModalState {
  isOpen: boolean;
  category: CategoryId | null;
}
