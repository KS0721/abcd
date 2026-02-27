// ========================================
// 카드 도메인 모델
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
  category: string; // CategoryId | 'emergency' | 사용자 정의
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

// 동사 추천 매핑
export type VerbSuggestions = Record<string, string[]>;
