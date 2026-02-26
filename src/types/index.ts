// ========================================
// AAC 앱 타입 정의
// ========================================

// 카테고리 ID (14개)
// 연구 근거: Beukelman & Mirenda (2013) Core+Fringe 모델
// descriptor: Laubscher & Light (2020) - 형용사가 모든 핵심어휘 목록에 포함
// animal: 일상 대화 고빈도 주변어휘 (Trembath et al., 2007)
// nature: 일상 대화 필수 (날씨/환경)
export type CategoryId =
  | 'person' | 'action' | 'feeling' | 'food'
  | 'place' | 'thing' | 'time' | 'expression'
  | 'body' | 'color' | 'medical'
  | 'descriptor' | 'animal' | 'nature';

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
  arasaacKeyword?: string;
  pictogramId?: number;
}

// 상황판
export interface SituationBoard {
  name: string;
  emoji: string;
  cards: SituationCard[];
}

export type SituationId =
  | 'home' | 'hospital' | 'restaurant' | 'school'
  | 'daycare' | 'car' | 'park' | 'mart' | 'bath'
  | 'cafe' | 'dental' | 'hairsalon' | 'exercise'
  | 'travel' | 'cinema' | 'library' | 'pool'
  | 'pharmacy' | 'workplace' | 'play';

// 동사 추천 매핑
export type VerbSuggestions = Record<string, string[]>;

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
}

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

// 스캐닝 설정 (자동 모드 전용, 3초 고정)
export interface ScanningConfig {
  speed: number;
}

// 뷰 타입
export type AppView = 'app';
export type SlideIndex = 0 | 1 | 2 | 3 | 4; // 말하기(0), 상황(1), 기록(2), 빠른문장(3), 설정(4)

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

export interface EditCardModalState {
  isOpen: boolean;
  card: Card | null;
  category: CategoryId | null;
}
