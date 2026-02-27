// ========================================
// grammarService.ts - 한국어 문법 처리 순수함수
//
// [규칙 기반 자동 조사]
// - 받침 유무로 은/는, 이/가, 을/를 자동 판별
// - 카테고리 + 동사 유형으로 주어/목적어/장소 역할 추론
// - 버튼 추가 횟수 0: 기존과 동일한 터치로 자연스러운 문장 생성
// 향후: LLM 기반 문맥 조사 선택 + 높임말 변환 확장 예정
// ========================================

import type { Card } from '../../card/models.ts';

// ========== 받침(종성) 판별 ==========

/** 한국어 글자의 받침 유무 판별 (유니코드 기반) */
function hasBatchim(char: string): boolean {
  const code = char.charCodeAt(0);
  if (code < 0xAC00 || code > 0xD7A3) return false;
  return (code - 0xAC00) % 28 !== 0;
}

/** 텍스트 마지막 한국어 글자의 받침 유무 */
function lastCharHasBatchim(text: string): boolean {
  // 숫자/영문/기호 등 제거하고 마지막 한국어 글자 찾기
  for (let i = text.length - 1; i >= 0; i--) {
    const code = text.charCodeAt(i);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      return hasBatchim(text[i]);
    }
  }
  return false;
}

// ========== 카드 문법 역할 추론 ==========

type GrammarRole = 'noun' | 'verb' | 'adjective' | 'adverb' | 'social' | 'particle';

/** 카드의 문법적 역할을 추론 */
function getCardRole(card: Card): GrammarRole {
  // 명시적 grammarType 우선
  if (card.grammarType === 'verb') return 'verb';
  if (card.grammarType === 'adjective') return 'adjective';
  if (card.grammarType === 'adverb') return 'adverb';
  if (card.grammarType === 'particle') return 'particle';
  if (card.grammarType === 'social' || card.grammarType === 'emergency') return 'social';
  if (card.grammarType === 'question' || card.grammarType === 'request') return 'social';

  // 카테고리 기반 추론
  switch (card.category) {
    case 'action': return 'verb';
    case 'feeling': return 'adjective';
    case 'descriptor': return 'adjective';
    case 'expression': return 'social';
    case 'time': return 'adverb';
    case 'person':
    case 'place':
    case 'thing':
    case 'food':
    case 'animal':
    case 'nature':
    case 'body':
    case 'color':
      return 'noun';
    case 'medical':
      // 의료: 텍스트가 서술형(~요)이면 형용사, 아니면 명사
      if (card.text.endsWith('요')) return 'adjective';
      return 'noun';
    default:
      // 기타 카테고리에서 서술형 텍스트 감지
      if (card.text.endsWith('요') || card.text.endsWith('다')) return 'adjective';
      return 'noun';
  }
}

// ========== 이동/자동사 동사 분류 ==========

/** 이동 동사 (장소 + 이동동사 → "에") */
const MOVEMENT_VERB_IDS = new Set([
  'a_go', 'a_come', 'a_walk', 'a_run', 'a_ride',
  'a_goup', 'a_godown', 'a_goback', 'a_goout', 'a_enter',
]);

/** 자동사 (주어 + 자동사 → "이/가") */
const INTRANSITIVE_VERB_IDS = new Set([
  // 이동 동사 포함
  'a_go', 'a_come', 'a_walk', 'a_run', 'a_ride',
  'a_goup', 'a_godown', 'a_goback', 'a_goout', 'a_enter',
  'a_swim', 'a_move',
  // 비이동 자동사
  'a_sit', 'a_stand', 'a_sleep', 'a_wakeup',
  'a_play', 'a_dance', 'a_exercise', 'a_hide',
  'a_stop',
]);

// ========== 자동 조사 삽입 ==========

/**
 * 명사 카드에 적절한 조사를 자동 결정
 *
 * 규칙:
 * 1. 장소 → 이동동사면 "에", 아니면 "에서"
 * 2. 신체 부위 → "이/가" (배가 아파요)
 * 3. 명사 1개 + 형용사 → "이/가" (날씨가 좋아요)
 * 4. 명사 1개 + 자동사 → "이/가" (아기가 자요)
 * 5. 명사 1개 + 타동사 → "을/를" (물을 마셔요)
 * 6. 명사 2개+: 첫 번째 → "은/는", 마지막 → "을/를" or 장소규칙
 * 7. "나/저" 단독 → "는" (나는 ~)
 *
 */
function autoParticle(
  noun: Card,
  nounIndex: number,
  totalNouns: number,
  predicate: Card | undefined,
  predicateRole: GrammarRole | undefined,
): string {
  const text = noun.text;
  const batchim = lastCharHasBatchim(text);
  const category = noun.category;

  // 장소 → 에/에서
  if (category === 'place') {
    if (predicate && MOVEMENT_VERB_IDS.has(predicate.id)) {
      return '에';   // 학교에 가요
    }
    return '에서';   // 학교에서 공부해요
  }

  // 신체 부위 → 이/가 (배가 아파요, 머리가 아파요)
  if (category === 'body') {
    return batchim ? '이' : '가';
  }

  // 명사 1개만 있는 경우
  if (totalNouns === 1) {
    // 형용사/감정 앞 → 이/가 (날씨가 좋아요, 음식이 맛있어요)
    if (predicateRole === 'adjective') {
      if (text === '나' || text === '저') return '는';
      return batchim ? '이' : '가';
    }

    // 사람 주어
    if (category === 'person') {
      if (text === '나' || text === '저') return '는';   // 나는 가요
      return batchim ? '이' : '가';                      // 엄마가 와요
    }

    // 자동사 앞 → 이/가 (아기가 자요, 비가 와요)
    if (predicate && INTRANSITIVE_VERB_IDS.has(predicate.id)) {
      return batchim ? '이' : '가';
    }

    // 타동사 앞 → 을/를 (물을 마셔요, 책을 읽어요)
    return batchim ? '을' : '를';
  }

  // 명사 2개 이상: 첫 번째 → 은/는 (주제)
  if (nounIndex === 1) {
    return batchim ? '은' : '는';
  }

  // 마지막 명사 → 을/를 (목적어)
  if (nounIndex === totalNouns) {
    return batchim ? '을' : '를';
  }

  // 중간 명사 (3개 이상일 때) → 조사 없음
  return '';
}

// ========== 기존 함수 (수정 없음) ==========

/**
 * 동사 교체용 판별 (selectCard에서 사용)
 * 동사가 이미 선택되어 있으면 새 동사로 교체할 때 사용
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
 */
const KEYWORD_MAP: Record<string, string> = {
  // 기본 동사 활용
  '자요': '자다', '먹어요': '먹다', '놀아요': '놀다', '가요': '가다',
  '봐요': '보다', '와요': '오다', '해요': '하다', '줘요': '주다',
  '타요': '타다', '싶어요': '싶다', '울어요': '울다', '뛰어요': '뛰다',
  '씻어요': '씻다', '닫아요': '닫다', '열어요': '열다', '읽어요': '읽다',
  '앉아요': '앉다', '서요': '서다', '마셔요': '마시다', '만들어요': '만들다',
  // 형용사/감정
  '좋아요': '좋다', '싫어요': '싫다', '아파요': '아프다', '무서워요': '무섭다',
  '추워요': '춥다', '더워요': '덥다', '배고파요': '배고프다', '졸려요': '졸리다',
  '힘들어요': '힘들다', '심심해요': '심심하다', '맛있어요': '맛있다',
  '매워요': '맵다', '뜨거워요': '뜨겁다', '차가워요': '차갑다',
  '무거워요': '무겁다', '어지러워요': '어지럽다', '간지러워요': '간지럽다',
  // ㅂ불규칙 (Kwon & Kim, 2019: 한국어 AAC 어휘 정규화)
  '가벼워요': '가볍다', '고마워요': '고맙다', '귀여워요': '귀엽다',
  '나빠요': '나쁘다', '예뻐요': '예쁘다', '기뻐요': '기쁘다',
  '슬퍼요': '슬프다', '바빠요': '바쁘다', '아름다워요': '아름답다',
  '부러워요': '부럽다', '즐거워요': '즐겁다', '반가워요': '반갑다',
  // ㄷ불규칙
  '걸어요': '걷다', '들어요': '듣다',
  // ㄹ탈락
  '살아요': '살다', '알아요': '알다', '놀라요': '놀라다',
  // 르불규칙
  '몰라요': '모르다', '빨라요': '빠르다', '달라요': '다르다',
  // 추가 동사 (상황판 관련)
  '입어요': '입다', '벗어요': '벗다', '잡아요': '잡다', '던져요': '던지다',
  '그려요': '그리다', '불러요': '부르다', '골라요': '고르다',
};

export function normalizeKeyword(text: string): string {
  const trimmed = text.trim();
  // 1순위: 명시적 매핑 (불규칙 활용 포함)
  if (KEYWORD_MAP[trimmed]) return KEYWORD_MAP[trimmed];
  // 2순위: 규칙 활용만 폴백 처리 (하다 동사 → 안전)
  if (trimmed.endsWith('해요')) return trimmed.replace(/해요$/, '하다');
  // 3순위: 기본형이 아닌 경우 원문 유지 (불규칙 오변환 방지)
  return trimmed;
}

// ========== 메시지 생성 (자동 조사 포함) ==========

/**
 * 선택된 카드 배열에서 메시지 문자열 생성
 *
 * - 수동 조사 카드(grammarType: 'particle')가 있으면 → 수동 모드 (기존 로직)
 * - 없으면 → 자동 조사 삽입 (규칙 기반)
 */
export function buildMessage(cards: Card[]): string {
  if (cards.length === 0) return '';
  if (cards.length === 1) return cards[0].text;

  // 수동 조사 카드가 있으면 기존 로직 사용
  const hasManualParticles = cards.some(
    (c) => c.grammarType === 'particle' || c.text.startsWith('~')
  );

  if (hasManualParticles) {
    return buildMessageManual(cards);
  }

  return buildMessageAuto(cards);
}

/** 수동 조사 모드: 조사 카드를 앞 단어에 붙임 (기존 로직) */
function buildMessageManual(cards: Card[]): string {
  let message = '';
  for (const card of cards) {
    const isParticle =
      card.grammarType === 'particle' || card.text.startsWith('~');
    if (isParticle && message.length > 0) {
      message += card.text.replace(/^~/, '');
    } else {
      if (message.length > 0) message += ' ';
      message += card.text;
    }
  }
  return message;
}

/** 자동 조사 모드: 카드 역할을 분석하여 조사 자동 삽입 */
function buildMessageAuto(cards: Card[]): string {
  const analyzed = cards.map((card) => ({
    card,
    role: getCardRole(card),
  }));

  // 서술어(동사/형용사) 찾기
  const predicate = analyzed.find((a) => a.role === 'verb' || a.role === 'adjective');
  const predicateRole = predicate?.role;

  // 명사 카드만 추출 (조사 대상)
  const nounCards = analyzed.filter((a) => a.role === 'noun');
  const totalNouns = nounCards.length;
  const hasPredicate = !!predicate;

  const parts: string[] = [];
  let nounsSeen = 0;

  for (const { card, role } of analyzed) {
    if (role === 'noun' && hasPredicate) {
      nounsSeen++;
      const particle = autoParticle(card, nounsSeen, totalNouns, predicate?.card, predicateRole);
      parts.push(card.text + particle);
    } else {
      parts.push(card.text);
    }
  }

  return parts.join(' ');
}
