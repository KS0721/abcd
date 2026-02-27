// ========================================
// cardService.ts - 카드 CRUD 순수 함수
// ========================================

import type { Card } from '../models.ts';

export function moveArrayItem<T>(arr: T[], from: number, to: number): T[] {
  const newArr = [...arr];
  const [item] = newArr.splice(from, 1);
  newArr.splice(to, 0, item);
  return newArr;
}

export function reorderCardsInCategory(
  cards: Record<string, Card[]>,
  category: string,
  from: number,
  to: number,
): Record<string, Card[]> {
  if (!cards[category]) return cards;
  return { ...cards, [category]: moveArrayItem(cards[category], from, to) };
}

export function addCardToCategory(
  cards: Record<string, Card[]>,
  userCards: Record<string, Card[]>,
  category: string,
  card: Card,
): { cards: Record<string, Card[]>; userCards: Record<string, Card[]> } {
  const newUserCards = { ...userCards, [category]: [...(userCards[category] || []), card] };
  const newCards = { ...cards, [category]: [...(cards[category] || []), card] };
  return { cards: newCards, userCards: newUserCards };
}

export function deleteCardFromCategory(
  cards: Record<string, Card[]>,
  userCards: Record<string, Card[]>,
  category: string,
  cardId: string,
): { cards: Record<string, Card[]>; userCards: Record<string, Card[]> } {
  const newUserCards = { ...userCards, [category]: (userCards[category] || []).filter((c) => c.id !== cardId) };
  const newCards = { ...cards, [category]: (cards[category] || []).filter((c) => c.id !== cardId) };
  return { cards: newCards, userCards: newUserCards };
}

export function updateCardInCategory(
  cards: Record<string, Card[]>,
  userCards: Record<string, Card[]>,
  category: string,
  cardId: string,
  updates: Partial<Card>,
): { cards: Record<string, Card[]>; userCards: Record<string, Card[]> } {
  const updateCard = (c: Card) => c.id === cardId ? { ...c, ...updates } : c;
  const newUserCards = { ...userCards, [category]: (userCards[category] || []).map(updateCard) };
  const newCards = { ...cards, [category]: (cards[category] || []).map(updateCard) };
  return { cards: newCards, userCards: newUserCards };
}

export function mergeUserCards(
  defaultCards: Record<string, Card[]>,
  savedUserCards: Record<string, Card[]> | null,
  savedOrder: Record<string, string[]> | null,
): { cards: Record<string, Card[]>; userCards: Record<string, Card[]> } {
  const cards = JSON.parse(JSON.stringify(defaultCards)) as Record<string, Card[]>;
  const userCards = savedUserCards || {} as Record<string, Card[]>;

  if (savedUserCards) {
    Object.keys(savedUserCards).forEach((cat) => {
      if (cards[cat] && savedUserCards[cat]) {
        cards[cat] = [...(defaultCards[cat] || []), ...savedUserCards[cat]];
      }
    });
  }

  if (savedOrder) {
    Object.keys(savedOrder).forEach((cat) => {
      if (cards[cat] && savedOrder[cat]) {
        const orderMap = new Map(savedOrder[cat].map((id, index) => [id, index]));
        cards[cat].sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));
      }
    });
  }

  return { cards, userCards };
}
