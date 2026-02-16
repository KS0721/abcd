/* ========================================
   cards.js - AAC 카드 데이터 (v4.0 재구성)

   [연구 근거]
   - 김영태 외(2003): 상위 50개 어휘가 전체 의사소통의 58% 차지
   - 전 연령대 공통 핵심어휘 33개 (가다, 나, 먹다, 보다, 하다...)
   - 고빈도 용언 기본형 64개 (하다, 되다, 보다, 오다, 가다...)
   - 박혜연 & 연석정(2020): 90%+ 응답률 필수 어휘
   - WCAG 터치 타겟 44px 최소 기준 준수

   [카테고리 구성]
   의미범주(Semantic Category) 기반 분류
   - 한 단어는 한 곳에만 (중복 제거)
   - 조사 제거 (AAC 사용자 직접 조합 비현실적)
   - 추가 버튼으로 사용자 맞춤 확장

   [이미지]
   ARASAAC 픽토그램 (CC BY-NC-SA)
   https://arasaac.org/
======================================== */

// ========== 긴급 카드 (항상 상단 고정, 6개) ==========
export const EMERGENCY_CARDS = [
    { id: 'em_help',    text: '도와주세요',  category: 'emergency', arasaacKeyword: '도움' },
    { id: 'em_pain',    text: '아파요',      category: 'emergency', arasaacKeyword: '아프다' },
    { id: 'em_toilet',  text: '화장실 가요', category: 'emergency', arasaacKeyword: '화장실' },
    { id: 'em_water',   text: '물 주세요',   category: 'emergency', arasaacKeyword: '물' },
    { id: 'em_scared',  text: '무서워요',    category: 'emergency', arasaacKeyword: '무섭다' },
    { id: 'em_stop',    text: '그만해요',    category: 'emergency', arasaacKeyword: '멈추다' }
];

// ========== 카테고리 정의 (8개) ==========
export const DEFAULT_CATEGORIES = [
    { id: 'person',     name: '사람' },
    { id: 'action',     name: '동작' },
    { id: 'feeling',    name: '감정' },
    { id: 'food',       name: '음식' },
    { id: 'place',      name: '장소' },
    { id: 'thing',      name: '사물' },
    { id: 'time',       name: '시간' },
    { id: 'expression', name: '표현' }
];

// ========== 카테고리 아이콘 (SVG) ==========
export const CATEGORY_ICONS = {
    person: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    action: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    feeling: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
    food: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    place: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    thing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    time: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    expression: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
};

// ========== 카테고리별 카드 데이터 (총 115개) ==========

export const DEFAULT_CARDS = {

    // ──────────────────────────────────────
    // 사람 (12개) - 주어 역할
    // ──────────────────────────────────────
    person: [
        { id: 'p_me',          text: '나',       category: 'person', arasaacKeyword: '나' },
        { id: 'p_mom',         text: '엄마',     category: 'person', arasaacKeyword: '엄마' },
        { id: 'p_dad',         text: '아빠',     category: 'person', arasaacKeyword: '아빠' },
        { id: 'p_grandma',     text: '할머니',   category: 'person', arasaacKeyword: '할머니' },
        { id: 'p_grandpa',     text: '할아버지', category: 'person', arasaacKeyword: '할아버지' },
        { id: 'p_sister',      text: '언니/누나', category: 'person', arasaacKeyword: '누나' },
        { id: 'p_brother',     text: '오빠/형',  category: 'person', arasaacKeyword: '형' },
        { id: 'p_younger',     text: '동생',     category: 'person', arasaacKeyword: '동생' },
        { id: 'p_teacher',     text: '선생님',   category: 'person', arasaacKeyword: '선생님' },
        { id: 'p_friend',      text: '친구',     category: 'person', arasaacKeyword: '친구' },
        { id: 'p_doctor',      text: '의사',     category: 'person', arasaacKeyword: '의사' },
        { id: 'p_family',      text: '가족',     category: 'person', arasaacKeyword: '가족' }
    ],

    // ──────────────────────────────────────
    // 동작 (20개) - 연구 기반 고빈도 동사
    // 하다(1위), 되다(5위), 보다(7위), 오다(13위), 가다(15위)...
    // ──────────────────────────────────────
    action: [
        { id: 'a_do',          text: '해요',     category: 'action', arasaacKeyword: '하다' },
        { id: 'a_go',          text: '가요',     category: 'action', arasaacKeyword: '가다' },
        { id: 'a_come',        text: '와요',     category: 'action', arasaacKeyword: '오다' },
        { id: 'a_see',         text: '봐요',     category: 'action', arasaacKeyword: '보다' },
        { id: 'a_give',        text: '줘요',     category: 'action', arasaacKeyword: '주다' },
        { id: 'a_eat',         text: '먹어요',   category: 'action', arasaacKeyword: '먹다' },
        { id: 'a_drink',       text: '마셔요',   category: 'action', arasaacKeyword: '마시다' },
        { id: 'a_sleep',       text: '자요',     category: 'action', arasaacKeyword: '자다' },
        { id: 'a_sit',         text: '앉아요',   category: 'action', arasaacKeyword: '앉다' },
        { id: 'a_stand',       text: '서요',     category: 'action', arasaacKeyword: '서다' },
        { id: 'a_walk',        text: '걸어요',   category: 'action', arasaacKeyword: '걷다' },
        { id: 'a_play',        text: '놀아요',   category: 'action', arasaacKeyword: '놀다' },
        { id: 'a_wash',        text: '씻어요',   category: 'action', arasaacKeyword: '씻다' },
        { id: 'a_wear',        text: '입어요',   category: 'action', arasaacKeyword: '입다' },
        { id: 'a_read',        text: '읽어요',   category: 'action', arasaacKeyword: '읽다' },
        { id: 'a_make',        text: '만들어요', category: 'action', arasaacKeyword: '만들다' },
        { id: 'a_wait',        text: '기다려요', category: 'action', arasaacKeyword: '기다리다' },
        { id: 'a_wakeup',      text: '일어나요', category: 'action', arasaacKeyword: '일어나다' },
        { id: 'a_open',        text: '열어요',   category: 'action', arasaacKeyword: '열다' },
        { id: 'a_ride',        text: '타요',     category: 'action', arasaacKeyword: '타다' }
    ],

    // ──────────────────────────────────────
    // 감정/상태 (15개) - 형용사 + 신체상태
    // 좋다(19위), 싫다(39위), 아프다(공통핵심)
    // ──────────────────────────────────────
    feeling: [
        { id: 'f_good',        text: '좋아요',   category: 'feeling', arasaacKeyword: '좋다' },
        { id: 'f_bad',         text: '싫어요',   category: 'feeling', arasaacKeyword: '싫다' },
        { id: 'f_happy',       text: '행복해요', category: 'feeling', arasaacKeyword: '행복하다' },
        { id: 'f_sad',         text: '슬퍼요',   category: 'feeling', arasaacKeyword: '슬프다' },
        { id: 'f_angry',       text: '화나요',   category: 'feeling', arasaacKeyword: '화나다' },
        { id: 'f_scared',      text: '무서워요', category: 'feeling', arasaacKeyword: '무섭다' },
        { id: 'f_hurt',        text: '아파요',   category: 'feeling', arasaacKeyword: '아프다' },
        { id: 'f_hungry',      text: '배고파요', category: 'feeling', arasaacKeyword: '배고프다' },
        { id: 'f_thirsty',     text: '목마르요', category: 'feeling', arasaacKeyword: '목마르다' },
        { id: 'f_sleepy',      text: '졸려요',   category: 'feeling', arasaacKeyword: '졸리다' },
        { id: 'f_tired',       text: '피곤해요', category: 'feeling', arasaacKeyword: '피곤하다' },
        { id: 'f_bored',       text: '심심해요', category: 'feeling', arasaacKeyword: '심심하다' },
        { id: 'f_fun',         text: '재밌어요', category: 'feeling', arasaacKeyword: '재미있다' },
        { id: 'f_okay',        text: '괜찮아요', category: 'feeling', arasaacKeyword: '괜찮다' },
        { id: 'f_surprised',   text: '놀랐어요', category: 'feeling', arasaacKeyword: '놀라다' }
    ],

    // ──────────────────────────────────────
    // 음식 (15개) - 한국 식생활 기반
    // ──────────────────────────────────────
    food: [
        { id: 'fd_rice',       text: '밥',       category: 'food', arasaacKeyword: '밥' },
        { id: 'fd_bread',      text: '빵',       category: 'food', arasaacKeyword: '빵' },
        { id: 'fd_soup',       text: '국',       category: 'food', arasaacKeyword: '국' },
        { id: 'fd_meat',       text: '고기',     category: 'food', arasaacKeyword: '고기' },
        { id: 'fd_sidedish',   text: '반찬',     category: 'food', arasaacKeyword: '반찬' },
        { id: 'fd_fruit',      text: '과일',     category: 'food', arasaacKeyword: '과일' },
        { id: 'fd_kimchi',     text: '김치',     category: 'food', arasaacKeyword: '김치' },
        { id: 'fd_noodle',     text: '라면',     category: 'food', arasaacKeyword: '라면' },
        { id: 'fd_egg',        text: '계란',     category: 'food', arasaacKeyword: '계란' },
        { id: 'fd_snack',      text: '과자',     category: 'food', arasaacKeyword: '과자' },
        { id: 'fd_water',      text: '물',       category: 'food', arasaacKeyword: '물' },
        { id: 'fd_milk',       text: '우유',     category: 'food', arasaacKeyword: '우유' },
        { id: 'fd_juice',      text: '주스',     category: 'food', arasaacKeyword: '주스' },
        { id: 'fd_yummy',      text: '맛있어요', category: 'food', arasaacKeyword: '맛있다' },
        { id: 'fd_full',       text: '배불러요', category: 'food', arasaacKeyword: '배부르다' }
    ],

    // ──────────────────────────────────────
    // 장소 (10개) - 일상 이동 장소
    // ──────────────────────────────────────
    place: [
        { id: 'pl_home',       text: '집',       category: 'place', arasaacKeyword: '집' },
        { id: 'pl_school',     text: '학교',     category: 'place', arasaacKeyword: '학교' },
        { id: 'pl_hospital',   text: '병원',     category: 'place', arasaacKeyword: '병원' },
        { id: 'pl_toilet',     text: '화장실',   category: 'place', arasaacKeyword: '화장실' },
        { id: 'pl_mart',       text: '마트',     category: 'place', arasaacKeyword: '슈퍼마켓' },
        { id: 'pl_park',       text: '공원',     category: 'place', arasaacKeyword: '공원' },
        { id: 'pl_restaurant', text: '식당',     category: 'place', arasaacKeyword: '식당' },
        { id: 'pl_room',       text: '방',       category: 'place', arasaacKeyword: '방' },
        { id: 'pl_outside',    text: '밖',       category: 'place', arasaacKeyword: '밖' },
        { id: 'pl_car',        text: '차',       category: 'place', arasaacKeyword: '자동차' }
    ],

    // ──────────────────────────────────────
    // 사물 (12개) - 일상 물건
    // ──────────────────────────────────────
    thing: [
        { id: 'th_clothes',    text: '옷',       category: 'thing', arasaacKeyword: '옷' },
        { id: 'th_shoes',      text: '신발',     category: 'thing', arasaacKeyword: '신발' },
        { id: 'th_bag',        text: '가방',     category: 'thing', arasaacKeyword: '가방' },
        { id: 'th_phone',      text: '핸드폰',   category: 'thing', arasaacKeyword: '휴대전화' },
        { id: 'th_tv',         text: 'TV',       category: 'thing', arasaacKeyword: '텔레비전' },
        { id: 'th_book',       text: '책',       category: 'thing', arasaacKeyword: '책' },
        { id: 'th_medicine',   text: '약',       category: 'thing', arasaacKeyword: '약' },
        { id: 'th_blanket',    text: '이불',     category: 'thing', arasaacKeyword: '이불' },
        { id: 'th_tissue',     text: '휴지',     category: 'thing', arasaacKeyword: '휴지' },
        { id: 'th_toy',        text: '장난감',   category: 'thing', arasaacKeyword: '장난감' },
        { id: 'th_ball',       text: '공',       category: 'thing', arasaacKeyword: '공' },
        { id: 'th_cup',        text: '컵',       category: 'thing', arasaacKeyword: '컵' }
    ],

    // ──────────────────────────────────────
    // 시간/인사 (10개) - 시간 + 사회적 표현
    // ──────────────────────────────────────
    time: [
        { id: 'tm_now',        text: '지금',     category: 'time', arasaacKeyword: '지금' },
        { id: 'tm_later',      text: '나중에',   category: 'time', arasaacKeyword: '나중에' },
        { id: 'tm_today',      text: '오늘',     category: 'time', arasaacKeyword: '오늘' },
        { id: 'tm_tomorrow',   text: '내일',     category: 'time', arasaacKeyword: '내일' },
        { id: 'tm_yesterday',  text: '어제',     category: 'time', arasaacKeyword: '어제' },
        { id: 'tm_hello',      text: '안녕',     category: 'time', arasaacKeyword: '안녕하세요' },
        { id: 'tm_thanks',     text: '고마워요', category: 'time', arasaacKeyword: '감사하다' },
        { id: 'tm_sorry',      text: '미안해요', category: 'time', arasaacKeyword: '미안하다' },
        { id: 'tm_goodnight',  text: '잘자',     category: 'time', arasaacKeyword: '잘자다' },
        { id: 'tm_wait',       text: '잠깐만요', category: 'time', arasaacKeyword: '기다리다' }
    ],

    // ──────────────────────────────────────
    // 표현 (15개) - 응답/부사/의문사
    // 네/아니오: 83% 응답률 (박혜연 & 연석정 2020)
    // ──────────────────────────────────────
    expression: [
        { id: 'ex_yes',        text: '네',       category: 'expression', arasaacKeyword: '네' },
        { id: 'ex_no',         text: '아니요',   category: 'expression', arasaacKeyword: '아니요' },
        { id: 'ex_want',       text: '원해요',   category: 'expression', arasaacKeyword: '원하다' },
        { id: 'ex_need',       text: '필요해요', category: 'expression', arasaacKeyword: '필요하다' },
        { id: 'ex_please',     text: '주세요',   category: 'expression', arasaacKeyword: '주세요' },
        { id: 'ex_more',       text: '더',       category: 'expression', arasaacKeyword: '더' },
        { id: 'ex_not',        text: '안',       category: 'expression', arasaacKeyword: '아니다' },
        { id: 'ex_again',      text: '또',       category: 'expression', arasaacKeyword: '또' },
        { id: 'ex_alot',       text: '많이',     category: 'expression', arasaacKeyword: '많다' },
        { id: 'ex_fast',       text: '빨리',     category: 'expression', arasaacKeyword: '빨리' },
        { id: 'ex_what',       text: '뭐',       category: 'expression', arasaacKeyword: '무엇' },
        { id: 'ex_where',      text: '어디',     category: 'expression', arasaacKeyword: '어디' },
        { id: 'ex_who',        text: '누구',     category: 'expression', arasaacKeyword: '누구' },
        { id: 'ex_why',        text: '왜',       category: 'expression', arasaacKeyword: '왜' },
        { id: 'ex_and',        text: '그리고',   category: 'expression', arasaacKeyword: '그리고' }
    ]
};

// ========== 상황판 데이터 (기존 유지) ==========
export const SITUATION_BOARDS = {
    home: {
        name: '집',
        emoji: '🏠',
        cards: [
            { id: 'sh_tv',       text: 'TV 봐요',     arasaacKeyword: '텔레비전' },
            { id: 'sh_snack',    text: '간식 줘요',    arasaacKeyword: '간식' },
            { id: 'sh_play',     text: '놀고 싶어요',  arasaacKeyword: '놀다' },
            { id: 'sh_sleep',    text: '자고 싶어요',  arasaacKeyword: '자다' },
            { id: 'sh_wash',     text: '씻어요',       arasaacKeyword: '씻다' },
            { id: 'sh_outside',  text: '밖에 가요',    arasaacKeyword: '밖' },
            { id: 'sh_hug',      text: '안아줘요',     arasaacKeyword: '포옹' },
            { id: 'sh_hot',      text: '더워요',       arasaacKeyword: '덥다' },
            { id: 'sh_cold',     text: '추워요',       arasaacKeyword: '춥다' }
        ]
    },
    hospital: {
        name: '병원',
        emoji: '🏥',
        cards: [
            { id: 'sho_hurt',     text: '아파요',       arasaacKeyword: '아프다' },
            { id: 'sho_head',     text: '머리 아파요',  arasaacKeyword: '머리' },
            { id: 'sho_stomach',  text: '배 아파요',    arasaacKeyword: '배' },
            { id: 'sho_fever',    text: '열나요',       arasaacKeyword: '열' },
            { id: 'sho_cough',    text: '기침해요',     arasaacKeyword: '기침' },
            { id: 'sho_nose',     text: '콧물 나요',    arasaacKeyword: '콧물' },
            { id: 'sho_nausea',   text: '토할것 같아요', arasaacKeyword: '구토' },
            { id: 'sho_dizzy',    text: '어지러워요',   arasaacKeyword: '어지럽다' },
            { id: 'sho_shot',     text: '주사 싫어요',  arasaacKeyword: '주사' },
            { id: 'sho_medicine', text: '약 주세요',    arasaacKeyword: '약' },
            { id: 'sho_scared',   text: '무서워요',     arasaacKeyword: '무섭다' },
            { id: 'sho_done',     text: '언제 끝나요?', arasaacKeyword: '끝나다' }
        ]
    },
    restaurant: {
        name: '식당',
        emoji: '🍽️',
        cards: [
            { id: 'sr_hungry',  text: '배고파요',    arasaacKeyword: '배고프다' },
            { id: 'sr_water',   text: '물 주세요',   arasaacKeyword: '물' },
            { id: 'sr_yummy',   text: '맛있어요',    arasaacKeyword: '맛있다' },
            { id: 'sr_more',    text: '더 주세요',   arasaacKeyword: '더' },
            { id: 'sr_full',    text: '배불러요',    arasaacKeyword: '배부르다' },
            { id: 'sr_hot',     text: '뜨거워요',    arasaacKeyword: '뜨겁다' },
            { id: 'sr_spicy',   text: '매워요',      arasaacKeyword: '맵다' },
            { id: 'sr_toilet',  text: '화장실 가요', arasaacKeyword: '화장실' },
            { id: 'sr_done',    text: '다 먹었어요', arasaacKeyword: '먹다' }
        ]
    },
    school: {
        name: '학교',
        emoji: '🏫',
        cards: [
            { id: 'ss_teacher',   text: '선생님',           arasaacKeyword: '선생님' },
            { id: 'ss_study',     text: '공부해요',         arasaacKeyword: '공부하다' },
            { id: 'ss_question',  text: '질문 있어요',      arasaacKeyword: '질문' },
            { id: 'ss_dontknow',  text: '모르겠어요',       arasaacKeyword: '모르다' },
            { id: 'ss_done',      text: '다 했어요',        arasaacKeyword: '끝나다' },
            { id: 'ss_break',     text: '쉬는 시간이에요?', arasaacKeyword: '쉬다' },
            { id: 'ss_toilet',    text: '화장실 가도 돼요?', arasaacKeyword: '화장실' },
            { id: 'ss_help',      text: '도와주세요',       arasaacKeyword: '도움' },
            { id: 'ss_again',     text: '다시 설명해주세요', arasaacKeyword: '설명하다' }
        ]
    },
    daycare: {
        name: '어린이집',
        emoji: '🧒',
        cards: [
            { id: 'sd_mom',     text: '엄마 보고싶어요', arasaacKeyword: '엄마' },
            { id: 'sd_play',    text: '놀고 싶어요',     arasaacKeyword: '놀다' },
            { id: 'sd_friend',  text: '친구랑 놀아요',   arasaacKeyword: '친구' },
            { id: 'sd_snack',   text: '간식 먹어요',     arasaacKeyword: '간식' },
            { id: 'sd_nap',     text: '자고 싶어요',     arasaacKeyword: '자다' },
            { id: 'sd_toilet',  text: '화장실 가요',     arasaacKeyword: '화장실' },
            { id: 'sd_cry',     text: '울고 싶어요',     arasaacKeyword: '울다' },
            { id: 'sd_hug',     text: '안아줘요',        arasaacKeyword: '포옹' },
            { id: 'sd_home',    text: '집에 가요',       arasaacKeyword: '집' }
        ]
    },
    car: {
        name: '차',
        emoji: '🚗',
        cards: [
            { id: 'sc_arrive',  text: '다 왔어요?',   arasaacKeyword: '도착하다' },
            { id: 'sc_toilet',  text: '화장실 가요',   arasaacKeyword: '화장실' },
            { id: 'sc_sick',    text: '멀미나요',      arasaacKeyword: '멀미' },
            { id: 'sc_window',  text: '창문 열어요',   arasaacKeyword: '창문' },
            { id: 'sc_water',   text: '물 주세요',     arasaacKeyword: '물' },
            { id: 'sc_music',   text: '음악 틀어요',   arasaacKeyword: '음악' },
            { id: 'sc_stop',    text: '세워주세요',    arasaacKeyword: '멈추다' },
            { id: 'sc_hot',     text: '더워요',        arasaacKeyword: '덥다' },
            { id: 'sc_cold',    text: '추워요',        arasaacKeyword: '춥다' }
        ]
    },
    park: {
        name: '공원',
        emoji: '🌳',
        cards: [
            { id: 'spk_swing',   text: '그네 타요',     arasaacKeyword: '그네' },
            { id: 'spk_slide',   text: '미끄럼틀 타요', arasaacKeyword: '미끄럼틀' },
            { id: 'spk_run',     text: '뛰어요',        arasaacKeyword: '뛰다' },
            { id: 'spk_ball',    text: '공놀이 해요',   arasaacKeyword: '공' },
            { id: 'spk_water',   text: '물 마셔요',     arasaacKeyword: '물' },
            { id: 'spk_toilet',  text: '화장실 가요',   arasaacKeyword: '화장실' },
            { id: 'spk_tired',   text: '힘들어요',      arasaacKeyword: '힘들다' },
            { id: 'spk_home',    text: '집에 가요',     arasaacKeyword: '집' },
            { id: 'spk_more',    text: '더 놀아요',     arasaacKeyword: '놀다' }
        ]
    },
    mart: {
        name: '마트',
        emoji: '🛒',
        cards: [
            { id: 'sm_want',     text: '이거 사요',     arasaacKeyword: '사다' },
            { id: 'sm_snack',    text: '과자 사요',     arasaacKeyword: '과자' },
            { id: 'sm_drink',    text: '음료 사요',     arasaacKeyword: '음료' },
            { id: 'sm_toy',      text: '장난감 사요',   arasaacKeyword: '장난감' },
            { id: 'sm_heavy',    text: '무거워요',      arasaacKeyword: '무겁다' },
            { id: 'sm_cart',     text: '카트 타요',     arasaacKeyword: '카트' },
            { id: 'sm_toilet',   text: '화장실 가요',   arasaacKeyword: '화장실' },
            { id: 'sm_home',     text: '집에 가요',     arasaacKeyword: '집' },
            { id: 'sm_carry',    text: '들어줘요',      arasaacKeyword: '들다' }
        ]
    },
    bath: {
        name: '목욕',
        emoji: '🛁',
        cards: [
            { id: 'sb_hot',      text: '뜨거워요',    arasaacKeyword: '뜨겁다' },
            { id: 'sb_cold',     text: '차가워요',    arasaacKeyword: '차갑다' },
            { id: 'sb_hair',     text: '머리 감아요', arasaacKeyword: '머리' },
            { id: 'sb_soap',     text: '비누 줘요',   arasaacKeyword: '비누' },
            { id: 'sb_done',     text: '다 씻었어요', arasaacKeyword: '씻다' },
            { id: 'sb_eyes',     text: '눈에 들어갔어요', arasaacKeyword: '눈' },
            { id: 'sb_towel',    text: '수건 줘요',   arasaacKeyword: '수건' },
            { id: 'sb_out',      text: '나갈래요',    arasaacKeyword: '나가다' },
            { id: 'sb_play',     text: '물놀이 해요', arasaacKeyword: '놀다' }
        ]
    }
};

// ========== 동사 추천 (단순화) ==========
export const VERB_SUGGESTIONS = {
    a_eat:   ['fd_rice', 'fd_bread', 'fd_fruit', 'fd_snack'],
    a_drink: ['fd_water', 'fd_milk', 'fd_juice'],
    a_go:    ['pl_home', 'pl_school', 'pl_hospital', 'pl_park'],
    a_ride:  ['pl_car'],
    a_read:  ['th_book'],
    a_wear:  ['th_clothes', 'th_shoes'],
    a_play:  ['th_toy', 'th_ball']
};
