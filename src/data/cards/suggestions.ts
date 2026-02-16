// ========================================
// suggestions.ts - 동사 선택 후 추천 카드
// ========================================

import type { VerbSuggestions } from '../../types';

export const VERB_SUGGESTIONS: VerbSuggestions = {
  a_eat:   ['fd_rice', 'fd_bread', 'fd_fruit', 'fd_snack'],
  a_drink: ['fd_water', 'fd_milk', 'fd_juice'],
  a_go:    ['pl_home', 'pl_school', 'pl_hospital', 'pl_park'],
  a_ride:  ['pl_car'],
  a_read:  ['th_book'],
  a_wear:  ['th_clothes', 'th_shoes'],
  a_play:  ['th_toy', 'th_ball'],
};
