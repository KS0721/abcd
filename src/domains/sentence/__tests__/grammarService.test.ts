import { describe, it, expect } from 'vitest';
import { buildMessage, sortCardsByGrammar, isVerbForReplacement, normalizeKeyword } from '../services/grammarService.ts';
import type { Card } from '../../card/models.ts';

function makeCard(overrides: Partial<Card> & { id: string; text: string }): Card {
  return { category: 'thing', ...overrides };
}

describe('buildMessage', () => {
  it('단일 카드는 텍스트 그대로 반환', () => {
    const cards = [makeCard({ id: 'fd_water', text: '물', category: 'food' })];
    expect(buildMessage(cards)).toBe('물');
  });

  it('명사 + 타동사 → 을/를 자동 삽입', () => {
    const cards = sortCardsByGrammar([
      makeCard({ id: 'fd_water', text: '물', category: 'food', grammarType: 'noun' }),
      makeCard({ id: 'a_drink', text: '마셔요', category: 'action', grammarType: 'verb' }),
    ]);
    expect(buildMessage(cards)).toBe('물을 마셔요');
  });

  it('장소 + 이동동사 → 에 삽입', () => {
    const cards = sortCardsByGrammar([
      makeCard({ id: 'pl_school', text: '학교', category: 'place', grammarType: 'noun' }),
      makeCard({ id: 'a_go', text: '가요', category: 'action', grammarType: 'verb' }),
    ]);
    expect(buildMessage(cards)).toBe('학교에 가요');
  });

  it('장소 + 비이동동사 → 에서 삽입', () => {
    const cards = sortCardsByGrammar([
      makeCard({ id: 'pl_school', text: '학교', category: 'place', grammarType: 'noun' }),
      makeCard({ id: 'a_study', text: '공부해요', category: 'action', grammarType: 'verb' }),
    ]);
    expect(buildMessage(cards)).toBe('학교에서 공부해요');
  });

  it('신체 부위 + 형용사 → 이/가 삽입', () => {
    const cards = sortCardsByGrammar([
      makeCard({ id: 'bd_stomach', text: '배', category: 'body', grammarType: 'noun' }),
      makeCard({ id: 'f_pain', text: '아파요', category: 'feeling', grammarType: 'adjective' }),
    ]);
    expect(buildMessage(cards)).toBe('배가 아파요');
  });

  it('받침 있는 명사 + 타동사 → 을 삽입', () => {
    const cards = sortCardsByGrammar([
      makeCard({ id: 'fd_bread', text: '빵', category: 'food', grammarType: 'noun' }),
      makeCard({ id: 'a_eat', text: '먹어요', category: 'action', grammarType: 'verb' }),
    ]);
    expect(buildMessage(cards)).toBe('빵을 먹어요');
  });

  it('명사 2개 + 동사 → 은/는 + 을/를', () => {
    const cards = sortCardsByGrammar([
      makeCard({ id: 'p_me', text: '나', category: 'person', grammarType: 'pronoun' }),
      makeCard({ id: 'fd_water', text: '물', category: 'food', grammarType: 'noun' }),
      makeCard({ id: 'a_drink', text: '마셔요', category: 'action', grammarType: 'verb' }),
    ]);
    expect(buildMessage(cards)).toBe('나는 물을 마셔요');
  });

  it('빈 배열 → 빈 문자열', () => {
    expect(buildMessage([])).toBe('');
  });
});

describe('sortCardsByGrammar', () => {
  it('동사를 맨 뒤로 정렬', () => {
    const cards = [
      makeCard({ id: 'a_go', text: '가요', category: 'action', grammarType: 'verb' }),
      makeCard({ id: 'pl_school', text: '학교', category: 'place', grammarType: 'noun' }),
    ];
    const sorted = sortCardsByGrammar(cards);
    expect(sorted[0].id).toBe('pl_school');
    expect(sorted[1].id).toBe('a_go');
  });
});

describe('isVerbForReplacement', () => {
  it('grammarType verb → true', () => {
    const card = makeCard({ id: 'test', text: '가요', grammarType: 'verb' });
    expect(isVerbForReplacement(card)).toBe(true);
  });

  it('a_ 접두사 → true', () => {
    const card = makeCard({ id: 'a_eat', text: '먹어요' });
    expect(isVerbForReplacement(card)).toBe(true);
  });

  it('일반 명사 → false', () => {
    const card = makeCard({ id: 'fd_water', text: '물', grammarType: 'noun' });
    expect(isVerbForReplacement(card)).toBe(false);
  });
});

describe('normalizeKeyword', () => {
  it('활용형 → 기본형 변환', () => {
    expect(normalizeKeyword('먹어요')).toBe('먹다');
    expect(normalizeKeyword('가요')).toBe('가다');
    expect(normalizeKeyword('무서워요')).toBe('무섭다');
  });

  it('해요 동사 → 하다 변환', () => {
    expect(normalizeKeyword('공부해요')).toBe('공부하다');
  });

  it('매핑에 없으면 원문 유지', () => {
    expect(normalizeKeyword('특수단어')).toBe('특수단어');
  });
});
