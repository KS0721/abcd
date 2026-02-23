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
 * ARASAAC 검색용 키워드 정규화
 * 한국어 활용형(~요, ~아요, ~어요 등)을 기본형(~다)으로 변환
 * 예: 자요→자다, 먹어요→먹다, 놀아요→놀다
 */
const KEYWORD_MAP: Record<string, string> = {
  '자요': '자다', '먹어요': '먹다', '놀아요': '놀다', '가요': '가다',
  '봐요': '보다', '와요': '오다', '해요': '하다', '줘요': '주다',
  '타요': '타다', '싶어요': '싶다', '울어요': '울다', '뛰어요': '뛰다',
  '씻어요': '씻다', '닫아요': '닫다', '열어요': '열다', '읽어요': '읽다',
  '앉아요': '앉다', '서요': '서다', '마셔요': '마시다', '만들어요': '만들다',
  '좋아요': '좋다', '싫어요': '싫다', '아파요': '아프다', '무서워요': '무섭다',
  '추워요': '춥다', '더워요': '덥다', '배고파요': '배고프다', '졸려요': '졸리다',
  '힘들어요': '힘들다', '심심해요': '심심하다', '맛있어요': '맛있다',
  '매워요': '맵다', '뜨거워요': '뜨겁다', '차가워요': '차갑다',
  '무거워요': '무겁다', '어지러워요': '어지럽다', '간지러워요': '간지럽다',
};

export function normalizeKeyword(text: string): string {
  const trimmed = text.trim();
  // 정확한 매핑이 있으면 사용
  if (KEYWORD_MAP[trimmed]) return KEYWORD_MAP[trimmed];
  // 기본적인 패턴 변환
  if (trimmed.endsWith('해요')) return trimmed.replace(/해요$/, '하다');
  if (trimmed.endsWith('어요')) return trimmed.replace(/어요$/, '다');
  if (trimmed.endsWith('아요')) return trimmed.replace(/아요$/, '다');
  if (trimmed.endsWith('요')) return trimmed.replace(/요$/, '다');
  return trimmed;
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
