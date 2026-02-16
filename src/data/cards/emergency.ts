// ========================================
// emergency.ts - 긴급 카드 (항상 상단 고정, 6개)
// ========================================

import type { Card } from '../../types';

export const EMERGENCY_CARDS: Card[] = [
  { id: 'em_help',   text: '도와주세요',  category: 'emergency', arasaacKeyword: '도움',   emergency: true },
  { id: 'em_pain',   text: '아파요',      category: 'emergency', arasaacKeyword: '아프다', emergency: true },
  { id: 'em_toilet', text: '화장실 가요', category: 'emergency', arasaacKeyword: '화장실', emergency: true },
  { id: 'em_water',  text: '물 주세요',   category: 'emergency', arasaacKeyword: '물',     emergency: true },
  { id: 'em_scared', text: '무서워요',    category: 'emergency', arasaacKeyword: '무섭다', emergency: true },
  { id: 'em_stop',   text: '그만해요',    category: 'emergency', arasaacKeyword: '멈추다', emergency: true },
];
