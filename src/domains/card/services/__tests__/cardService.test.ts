import { describe, it, expect } from 'vitest';
import {
  moveArrayItem,
  reorderCardsInCategory,
  addCardToCategory,
  deleteCardFromCategory,
  updateCardInCategory,
  mergeUserCards,
} from '../cardService.ts';
import type { Card, CategoryId } from '../../models.ts';

function makeCard(id: string, text: string): Card {
  return { id, text, category: 'thing' };
}

function makeCards(): Record<CategoryId, Card[]> {
  return {
    thing: [makeCard('t1', '의자'), makeCard('t2', '책상'), makeCard('t3', '컵')],
    food: [makeCard('f1', '밥'), makeCard('f2', '물')],
  } as Record<CategoryId, Card[]>;
}

describe('moveArrayItem', () => {
  it('앞에서 뒤로 이동', () => {
    const result = moveArrayItem([1, 2, 3, 4], 0, 2);
    expect(result).toEqual([2, 3, 1, 4]);
  });

  it('뒤에서 앞으로 이동', () => {
    const result = moveArrayItem(['a', 'b', 'c'], 2, 0);
    expect(result).toEqual(['c', 'a', 'b']);
  });

  it('같은 위치로 이동하면 순서 유지', () => {
    const result = moveArrayItem([1, 2, 3], 1, 1);
    expect(result).toEqual([1, 2, 3]);
  });

  it('원본 배열 불변', () => {
    const original = [1, 2, 3];
    const result = moveArrayItem(original, 0, 2);
    expect(original).toEqual([1, 2, 3]);
    expect(result).not.toBe(original);
  });
});

describe('reorderCardsInCategory', () => {
  it('카테고리 내 카드 순서 변경', () => {
    const cards = makeCards();
    const result = reorderCardsInCategory(cards, 'thing', 0, 2);
    expect(result.thing.map((c) => c.id)).toEqual(['t2', 't3', 't1']);
  });

  it('존재하지 않는 카테고리면 원본 반환', () => {
    const cards = makeCards();
    const result = reorderCardsInCategory(cards, 'medical' as CategoryId, 0, 1);
    expect(result).toBe(cards);
  });
});

describe('addCardToCategory', () => {
  it('카드 추가 시 cards와 userCards 모두 업데이트', () => {
    const cards = makeCards();
    const userCards = {} as Record<CategoryId, Card[]>;
    const newCard = makeCard('t4', '연필');
    const result = addCardToCategory(cards, userCards, 'thing', newCard);
    expect(result.cards.thing).toHaveLength(4);
    expect(result.cards.thing[3].id).toBe('t4');
    expect(result.userCards.thing).toHaveLength(1);
    expect(result.userCards.thing[0].id).toBe('t4');
  });

  it('빈 카테고리에도 추가 가능', () => {
    const cards = {} as Record<CategoryId, Card[]>;
    const userCards = {} as Record<CategoryId, Card[]>;
    const newCard = makeCard('m1', '약');
    const result = addCardToCategory(cards, userCards, 'medical', newCard);
    expect(result.cards.medical).toHaveLength(1);
    expect(result.userCards.medical).toHaveLength(1);
  });
});

describe('deleteCardFromCategory', () => {
  it('카드 삭제 시 cards와 userCards 모두에서 제거', () => {
    const cards = makeCards();
    const userCards = { thing: [makeCard('t3', '컵')] } as Record<CategoryId, Card[]>;
    const result = deleteCardFromCategory(cards, userCards, 'thing', 't3');
    expect(result.cards.thing).toHaveLength(2);
    expect(result.userCards.thing).toHaveLength(0);
  });

  it('존재하지 않는 ID 삭제 시도 시 변화 없음', () => {
    const cards = makeCards();
    const userCards = {} as Record<CategoryId, Card[]>;
    const result = deleteCardFromCategory(cards, userCards, 'thing', 'nonexistent');
    expect(result.cards.thing).toHaveLength(3);
  });
});

describe('updateCardInCategory', () => {
  it('카드 텍스트 업데이트', () => {
    const cards = makeCards();
    const userCards = { thing: [makeCard('t1', '의자')] } as Record<CategoryId, Card[]>;
    const result = updateCardInCategory(cards, userCards, 'thing', 't1', { text: '소파' });
    expect(result.cards.thing[0].text).toBe('소파');
    expect(result.userCards.thing[0].text).toBe('소파');
  });
});

describe('mergeUserCards', () => {
  it('기본 카드에 사용자 카드 병합', () => {
    const defaults = { thing: [makeCard('t1', '의자')] } as Record<CategoryId, Card[]>;
    const saved = { thing: [makeCard('u1', '커스텀')] } as Record<CategoryId, Card[]>;
    const result = mergeUserCards(defaults, saved, null);
    expect(result.cards.thing).toHaveLength(2);
    expect(result.cards.thing[0].id).toBe('t1');
    expect(result.cards.thing[1].id).toBe('u1');
  });

  it('저장된 순서 적용', () => {
    const defaults = {
      thing: [makeCard('t1', '의자'), makeCard('t2', '책상')],
    } as Record<CategoryId, Card[]>;
    const order = { thing: ['t2', 't1'] };
    const result = mergeUserCards(defaults, null, order);
    expect(result.cards.thing[0].id).toBe('t2');
    expect(result.cards.thing[1].id).toBe('t1');
  });

  it('savedUserCards가 null이면 기본 카드만', () => {
    const defaults = { food: [makeCard('f1', '밥')] } as Record<CategoryId, Card[]>;
    const result = mergeUserCards(defaults, null, null);
    expect(result.cards.food).toHaveLength(1);
    expect(result.userCards).toEqual({});
  });
});
