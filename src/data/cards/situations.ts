// ========================================
// situations.ts - 상황판 데이터 (9개)
// ========================================

import type { SituationBoard, SituationId } from '../../types';

export const SITUATION_BOARDS: Record<SituationId, SituationBoard> = {
  home: {
    name: '집', emoji: '🏠',
    cards: [
      { id: 'sh_tv', text: 'TV 봐요', arasaacKeyword: '텔레비전' },
      { id: 'sh_snack', text: '간식 줘요', arasaacKeyword: '간식' },
      { id: 'sh_play', text: '놀고 싶어요', arasaacKeyword: '놀다' },
      { id: 'sh_sleep', text: '자고 싶어요', arasaacKeyword: '자다' },
      { id: 'sh_wash', text: '씻어요', arasaacKeyword: '씻다' },
      { id: 'sh_outside', text: '밖에 가요', arasaacKeyword: '밖에' },
      { id: 'sh_hug', text: '안아줘요', arasaacKeyword: '포옹' },
      { id: 'sh_hot', text: '더워요', arasaacKeyword: '덥다' },
      { id: 'sh_cold', text: '추워요', arasaacKeyword: '춥다' },
    ],
  },
  hospital: {
    name: '병원', emoji: '🏥',
    cards: [
      { id: 'sho_hurt', text: '아파요', arasaacKeyword: '아프다' },
      { id: 'sho_head', text: '머리 아파요', arasaacKeyword: '머리' },
      { id: 'sho_stomach', text: '배 아파요', arasaacKeyword: '배고프다' },
      // ↑ "배" 검색 시 배(船) 반환! "배고프다"(배 아이콘)로 대체
      { id: 'sho_fever', text: '열나요', arasaacKeyword: '열' },
      { id: 'sho_cough', text: '기침해요', arasaacKeyword: '기침' },
      { id: 'sho_nose', text: '콧물 나요', arasaacKeyword: '콧물' },
      { id: 'sho_nausea', text: '토할것 같아요', arasaacKeyword: '구토' },
      { id: 'sho_dizzy', text: '어지러워요', arasaacKeyword: '어지럽다' },
      { id: 'sho_shot', text: '주사 싫어요', arasaacKeyword: '주사' },
      { id: 'sho_medicine', text: '약 주세요', arasaacKeyword: '약' },
      { id: 'sho_scared', text: '무서워요', arasaacKeyword: '무섭다' },
      { id: 'sho_done', text: '언제 끝나요?', arasaacKeyword: '끝나다' },
    ],
  },
  restaurant: {
    name: '식당', emoji: '🍽️',
    cards: [
      { id: 'sr_hungry', text: '배고파요', arasaacKeyword: '배고프다' },
      { id: 'sr_water', text: '물 주세요', arasaacKeyword: '물' },
      { id: 'sr_yummy', text: '맛있어요', arasaacKeyword: '맛있다' },
      { id: 'sr_more', text: '더 주세요', arasaacKeyword: '더' },
      { id: 'sr_full', text: '배불러요', arasaacKeyword: '배부르다' },
      { id: 'sr_hot', text: '뜨거워요', arasaacKeyword: '뜨겁다' },
      { id: 'sr_spicy', text: '매워요', arasaacKeyword: '맵다' },
      { id: 'sr_toilet', text: '화장실 가요', arasaacKeyword: '화장실' },
      { id: 'sr_done', text: '다 먹었어요', arasaacKeyword: '먹다' },
    ],
  },
  school: {
    name: '학교', emoji: '🏫',
    cards: [
      { id: 'ss_teacher', text: '선생님', arasaacKeyword: '선생님' },
      { id: 'ss_study', text: '공부해요', arasaacKeyword: '공부하다' },
      { id: 'ss_question', text: '질문 있어요', arasaacKeyword: '질문' },
      { id: 'ss_dontknow', text: '모르겠어요', arasaacKeyword: '모르다' },
      { id: 'ss_done', text: '다 했어요', arasaacKeyword: '끝나다' },
      { id: 'ss_break', text: '쉬는 시간이에요?', arasaacKeyword: '쉬다' },
      { id: 'ss_toilet', text: '화장실 가도 돼요?', arasaacKeyword: '화장실' },
      { id: 'ss_help', text: '도와주세요', arasaacKeyword: '도움' },
      { id: 'ss_again', text: '다시 설명해주세요', arasaacKeyword: '설명하다' },
    ],
  },
  daycare: {
    name: '어린이집', emoji: '🧒',
    cards: [
      { id: 'sd_mom', text: '엄마 보고싶어요', arasaacKeyword: '엄마' },
      { id: 'sd_play', text: '놀고 싶어요', arasaacKeyword: '놀다' },
      { id: 'sd_friend', text: '친구랑 놀아요', arasaacKeyword: '친구' },
      { id: 'sd_snack', text: '간식 먹어요', arasaacKeyword: '간식' },
      { id: 'sd_nap', text: '자고 싶어요', arasaacKeyword: '자다' },
      { id: 'sd_toilet', text: '화장실 가요', arasaacKeyword: '화장실' },
      { id: 'sd_cry', text: '울고 싶어요', arasaacKeyword: '울다' },
      { id: 'sd_hug', text: '안아줘요', arasaacKeyword: '포옹' },
      { id: 'sd_home', text: '집에 가요', arasaacKeyword: '집' },
    ],
  },
  car: {
    name: '차', emoji: '🚗',
    cards: [
      { id: 'sc_arrive', text: '다 왔어요?', arasaacKeyword: '도착하다' },
      { id: 'sc_toilet', text: '화장실 가요', arasaacKeyword: '화장실' },
      { id: 'sc_sick', text: '멀미나요', arasaacKeyword: '멀미' },
      { id: 'sc_window', text: '창문 열어요', arasaacKeyword: '창문' },
      { id: 'sc_water', text: '물 주세요', arasaacKeyword: '물' },
      { id: 'sc_music', text: '음악 틀어요', arasaacKeyword: '음악' },
      { id: 'sc_stop', text: '세워주세요', arasaacKeyword: '멈추다' },
      { id: 'sc_hot', text: '더워요', arasaacKeyword: '덥다' },
      { id: 'sc_cold', text: '추워요', arasaacKeyword: '춥다' },
    ],
  },
  park: {
    name: '공원', emoji: '🌳',
    cards: [
      { id: 'spk_swing', text: '그네 타요', arasaacKeyword: '그네' },
      { id: 'spk_slide', text: '미끄럼틀 타요', arasaacKeyword: '미끄럼틀' },
      { id: 'spk_run', text: '뛰어요', arasaacKeyword: '뛰다' },
      { id: 'spk_ball', text: '공놀이 해요', arasaacKeyword: '공' },
      { id: 'spk_water', text: '물 마셔요', arasaacKeyword: '물' },
      { id: 'spk_toilet', text: '화장실 가요', arasaacKeyword: '화장실' },
      { id: 'spk_tired', text: '힘들어요', arasaacKeyword: '힘들다' },
      { id: 'spk_home', text: '집에 가요', arasaacKeyword: '집' },
      { id: 'spk_more', text: '더 놀아요', arasaacKeyword: '놀다' },
    ],
  },
  mart: {
    name: '마트', emoji: '🛒',
    cards: [
      { id: 'sm_want', text: '이거 사요', arasaacKeyword: '사다' },
      { id: 'sm_snack', text: '과자 사요', arasaacKeyword: '과자' },
      { id: 'sm_drink', text: '음료 사요', arasaacKeyword: '음료' },
      { id: 'sm_toy', text: '장난감 사요', arasaacKeyword: '장난감' },
      { id: 'sm_heavy', text: '무거워요', arasaacKeyword: '무겁다' },
      { id: 'sm_cart', text: '카트 타요', arasaacKeyword: '카트' },
      { id: 'sm_toilet', text: '화장실 가요', arasaacKeyword: '화장실' },
      { id: 'sm_home', text: '집에 가요', arasaacKeyword: '집' },
      { id: 'sm_carry', text: '들어줘요', arasaacKeyword: '들다' },
    ],
  },
  bath: {
    name: '목욕', emoji: '🛁',
    cards: [
      { id: 'sb_hot', text: '뜨거워요', arasaacKeyword: '뜨겁다' },
      { id: 'sb_cold', text: '차가워요', arasaacKeyword: '차갑다' },
      { id: 'sb_hair', text: '머리 감아요', arasaacKeyword: '머리' },
      { id: 'sb_soap', text: '비누 줘요', arasaacKeyword: '비누' },
      { id: 'sb_done', text: '다 씻었어요', arasaacKeyword: '씻다' },
      { id: 'sb_eyes', text: '눈에 들어갔어요', arasaacKeyword: '눈' },
      { id: 'sb_towel', text: '수건 줘요', arasaacKeyword: '수건' },
      { id: 'sb_out', text: '나갈래요', arasaacKeyword: '나가다' },
      { id: 'sb_play', text: '물놀이 해요', arasaacKeyword: '놀다' },
    ],
  },
};
