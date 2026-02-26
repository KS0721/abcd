// ========================================
// 상황판 도메인 모델
// ========================================

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
