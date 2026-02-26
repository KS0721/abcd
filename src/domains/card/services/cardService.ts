// ========================================
// cardService.ts - 카드 CRUD 순수 함수
// ========================================

import type { Card, CategoryId } from '../models.ts';

export function moveArrayItem<T>(arr: T[], from: number, to: number): T[] {
  const newArr = [...arr];
  const [item] = newArr.splice(from, 1);
  newArr.splice(to, 0, item);
  return newArr;
}

export function reorderCardsInCategory(
  cards: Record<CategoryId, Card[]>,
  category: CategoryId,
  from: number,
  to: number,
): Record<CategoryId, Card[]> {
  if (!cards[category]) return cards;
  return { ...cards, [category]: moveArrayItem(cards[category], from, to) };
}

export function addCardToCategory(
  cards: Record<CategoryId, Card[]>,
  userCards: Record<CategoryId, Card[]>,
  category: CategoryId,
  card: Card,
): { cards: Record<CategoryId, Card[]>; userCards: Record<CategoryId, Card[]> } {
  const newUserCards = { ...userCards, [category]: [...(userCards[category] || []), card] };
  const newCards = { ...cards, [category]: [...(cards[category] || []), card] };
  return { cards: newCards, userCards: newUserCards };
}

export function deleteCardFromCategory(
  cards: Record<CategoryId, Card[]>,
  userCards: Record<CategoryId, Card[]>,
  category: CategoryId,
  cardId: string,
): { cards: Record<CategoryId, Card[]>; userCards: Record<CategoryId, Card[]> } {
  const newUserCards = { ...userCards, [category]: (userCards[category] || []).filter((c) => c.id !== cardId) };
  const newCards = { ...cards, [category]: (cards[category] || []).filter((c) => c.id !== cardId) };
  return { cards: newCards, userCards: newUserCards };
}

export function updateCardInCategory(
  cards: Record<CategoryId, Card[]>,
  userCards: Record<CategoryId, Card[]>,
  category: CategoryId,
  cardId: string,
  updates: Partial<Card>,
): { cards: Record<CategoryId, Card[]>; userCards: Record<CategoryId, Card[]> } {
  const updateCard = (c: Card) => c.id === cardId ? { ...c, ...updates } : c;
  const newUserCards = { ...userCards, [category]: (userCards[category] || []).map(updateCard) };
  const newCards = { ...cards, [category]: (cards[category] || []).map(updateCard) };
  return { cards: newCards, userCards: newUserCards };
}

export function mergeUserCards(
  defaultCards: Record<CategoryId, Card[]>,
  savedUserCards: Record<CategoryId, Card[]> | null,
  savedOrder: Record<string, string[]> | null,
): { cards: Record<CategoryId, Card[]>; userCards: Record<CategoryId, Card[]> } {
  const cards = JSON.parse(JSON.stringify(defaultCards)) as Record<CategoryId, Card[]>;
  const userCards = savedUserCards || {} as Record<CategoryId, Card[]>;

  if (savedUserCards) {
    Object.keys(savedUserCards).forEach((cat) => {
      const category = cat as CategoryId;
      if (cards[category] && savedUserCards[category]) {
        cards[category] = [...(defaultCards[category] || []), ...savedUserCards[category]];
      }
    });
  }

  if (savedOrder) {
    Object.keys(savedOrder).forEach((cat) => {
      const category = cat as CategoryId;
      if (cards[category] && savedOrder[cat]) {
        const orderMap = new Map(savedOrder[cat].map((id, index) => [id, index]));
        cards[category].sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));
      }
    });
  }

  return { cards, userCards };
}
