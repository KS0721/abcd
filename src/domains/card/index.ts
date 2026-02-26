// ========================================
// card/index.ts - 카드 도메인 barrel export
// ========================================

// 모델 (타입)
export type { Card, CategoryId, Category, VerbSuggestions } from './models.ts';

// 데이터
export {
  DEFAULT_CATEGORIES,
  CATEGORY_ICONS,
  EMERGENCY_CARDS,
  DEFAULT_CARDS,
  VERB_SUGGESTIONS,
} from './data/index.ts';

// 커스텀 픽토그램
export {
  KIMCHI_SVG, FULL_STOMACH_SVG, SIDE_DISH_SVG, RAMEN_SVG, RICE_SVG,
  TTEOKBOKKI_SVG, GIMBAP_SVG, BIBIMBAP_SVG, BULGOGI_SVG, SAMGYEOPSAL_SVG,
  DOENJANG_SVG, CONVENIENCE_STORE_SVG,
  TTEOK_SVG, NAENGMYEON_SVG, FRIEDRICE_SVG, PORRIDGE_SVG,
  EVERYDAY_SVG, NEXT_WEEK_SVG, LAST_WEEK_SVG,
  YET_SVG, ALREADY_SVG, MAYBE_SVG, REALLY_SVG, ALMOST_SVG,
  RIGHTAWAY_SVG, SUDDENLY_SVG, FINALLY_SVG,
  SO_SVG, IF_SVG, ALSO_SVG, INSTEAD_SVG, MUST_SVG,
  SENIOR_SVG, SOMETIMES_SVG,
} from './data/index.ts';

// 서비스
export {
  moveArrayItem,
  reorderCardsInCategory,
  addCardToCategory,
  deleteCardFromCategory,
  updateCardInCategory,
  mergeUserCards,
} from './services/index.ts';

// 스토어
export { useCardStore } from './store/index.ts';
