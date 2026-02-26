// ========================================
// suggestions.ts - 동사 선택 후 추천 카드
//
// 논문 근거:
//   - Trnka et al. (2009, NAACL): N-gram 언어모델 AAC 단어 예측 → 입력 40% 감소
//   - Valencia et al. (2023, CHI): 문맥 기반 추천 → AAC 소통 속도 2배 향상
//   - Higginbotham & Wilkins (1999): 대화 이력 기반 추천 → 반복 발화 속도 50% 향상
//
// 원칙:
//   - 동사 선택 시 문법적으로 자연스러운 목적어/장소/도구를 추천
//   - 빈도 높은 조합을 우선 배치 (김영태 외, 2003: 핵심어휘 빈도)
//   - 최대 8개 추천 (인지 부하 최소화)
// ========================================

import type { VerbSuggestions } from '../models.ts';

export const VERB_SUGGESTIONS: VerbSuggestions = {
  // === 일상 기본 동사 ===
  a_eat:      ['fd_rice', 'fd_bread', 'fd_fruit', 'fd_snack', 'fd_meat', 'fd_kimchi', 'fd_noodle', 'fd_bibimbap'],
  a_drink:    ['fd_water', 'fd_milk', 'fd_juice', 'fd_coffee', 'fd_tea'],
  a_go:       ['pl_home', 'pl_school', 'pl_hospital', 'pl_park', 'pl_mart', 'pl_toilet', 'pl_restaurant'],
  a_come:     ['pl_home', 'pl_school', 'p_friend', 'p_mom', 'p_dad'],
  a_ride:     ['pl_car', 'th_elevator'],
  a_read:     ['th_book'],
  a_wear:     ['th_clothes', 'th_shoes', 'th_glasses', 'th_mask'],

  // === 의사소통/사회 동사 ===
  a_see:      ['p_friend', 'p_teacher', 'p_mom', 'p_dad', 'p_doctor', 'th_tv', 'th_phone'],
  a_give:     ['p_friend', 'p_teacher', 'p_mom', 'th_money', 'fd_water'],
  a_talk:     ['p_friend', 'p_teacher', 'p_mom', 'p_dad', 'th_phone'],
  a_send:     ['p_friend', 'p_teacher', 'p_mom'],
  a_receive:  ['p_friend', 'p_teacher', 'th_money'],
  a_call:     ['p_mom', 'p_dad', 'p_friend', 'p_teacher', 'p_doctor'],
  a_answer:   ['p_teacher', 'p_friend'],

  // === 생활/위생 동사 ===
  a_sleep:    ['th_bed', 'th_blanket', 'th_pillow', 'pl_room'],
  a_wash:     ['bd_hand', 'bd_face', 'th_soap', 'th_towel'],
  a_sit:      ['th_chair', 'th_sofa', 'th_bed'],
  a_stand:    [],
  a_walk:     ['pl_park', 'pl_school', 'pl_home'],
  a_wakeup:   ['tm_morning'],
  a_clean:    ['pl_room', 'pl_kitchen', 'th_trashcan'],
  a_cook:     ['fd_rice', 'fd_meat', 'fd_soup', 'pl_kitchen'],

  // === 학습/활동 동사 ===
  a_play:     ['th_toy', 'th_ball', 'p_friend', 'pl_playground', 'pl_park'],
  a_study:    ['th_book', 'th_pencil', 'pl_school', 'pl_classroom'],
  a_write:    ['th_pencil', 'th_book'],
  a_draw:     ['th_crayon', 'th_crayon2'],
  a_listen:   ['p_teacher', 'th_earphone', 'th_speaker'],
  a_sing:     ['th_mic'],
  a_dance:    [],
  a_make:     ['th_toy'],

  // === 이동 동사 ===
  a_run:      ['pl_park', 'pl_playground'],
  a_swim:     ['pl_pool'],
  a_exercise: ['pl_gym', 'pl_park'],
  a_goup:     ['th_stairs', 'th_elevator'],
  a_godown:   ['th_stairs', 'th_elevator'],
  a_goback:   ['pl_home', 'pl_classroom'],
  a_goout:    ['pl_outside'],
  a_enter:    ['pl_room', 'pl_classroom'],

  // === 조작 동사 ===
  a_open:     ['th_door', 'th_window', 'th_book', 'th_bag'],
  a_close:    ['th_door', 'th_window', 'th_book'],
  a_turnon:   ['th_tv', 'th_lamp', 'th_fan', 'th_ac'],
  a_turnoff:  ['th_tv', 'th_lamp', 'th_fan', 'th_ac'],
  a_put:      ['th_bag', 'th_box', 'th_fridge'],
  a_buy:      ['fd_snack', 'fd_water', 'th_clothes', 'pl_mart', 'pl_convenience'],
  a_find:     ['th_phone', 'th_key', 'th_wallet', 'th_bag'],
  a_photo:    ['th_camera', 'th_phone'],
  a_cut:      ['th_scissors'],
  a_change:   ['th_clothes'],
};
