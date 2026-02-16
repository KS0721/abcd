// ========================================
// grammar.ts - 한국어 문법 처리 순수함수
// 출처: state.js:215-333
// ========================================

import type { Card } from '../types';

/**
 * 동사 교체용 판별 (selectCard에서 사용)
 * 동사가 이미 선택되어 있으면 새 동사로 교체할 때 사용
 * 출처: state.js:215-224
 */
export function isVerbForReplacement(card: Card): boolean {
  return (
    card.grammarType === 'verb' ||
    card.id.startsWith('c_do') || card.id.startsWith('c_go') ||
    card.id.startsWith('c_come') || card.id.startsWith('c_see') ||
    card.id.startsWith('c_give') || card.id.startsWith('c_eat') ||
    card.id.startsWith('c_drink') || card.id.startsWith('c_exist') ||
    card.id.startsWith('c_notexist') || card.id.startsWith('c_want') ||
    card.id.startsWith('act_') ||
    card.id.startsWith('a_') ||
    card.id.startsWith('fo_') ||
    card.id.startsWith('em')
  );
}

/**
 * 정렬용 동사 판별 (sortCardsByGrammar에서 사용)
 * 비동사 선택순서 유지, 동사는 맨 뒤로
 * 출처: state.js:276-280
 */
export function isVerbForSorting(card: Card): boolean {
  return (
    card.grammarType === 'verb' ||
    card.grammarType === 'question' ||
    card.grammarType === 'request' ||
    card.id.startsWith('act_') ||
    card.id.startsWith('a_') ||
    card.id.startsWith('em')
  );
}

/**
 * 문법 순서로 카드 정렬
 * 규칙: 비동사는 사용자 선택 순서 유지, 동사는 맨 뒤로
 * 출처: state.js:268-291
 */
export function sortCardsByGrammar(cards: Card[]): Card[] {
  if (cards.length <= 1) return cards;

  const verbs: Card[] = [];
  const nonVerbs: Card[] = [];

  cards.forEach((card) => {
    if (isVerbForSorting(card)) {
      verbs.push(card);
    } else {
      nonVerbs.push(card);
    }
  });

  return [...nonVerbs, ...verbs];
}

/**
 * 선택된 카드 배열에서 메시지 문자열 생성
 * 조사는 앞 단어에 공백 없이 붙임, 틸드(~) 제거
 * 출처: state.js:309-333
 */
export function buildMessage(cards: Card[]): string {
  let message = '';

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const isParticle =
      card.grammarType === 'particle' || card.text.startsWith('~');

    if (isParticle && message.length > 0) {
      const particleText = card.text.replace(/^~/, '');
      message += particleText;
    } else {
      if (message.length > 0) {
        message += ' ';
      }
      message += card.text;
    }
  }

  return message;
}
