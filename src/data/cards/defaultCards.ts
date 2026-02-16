// ========================================
// defaultCards.ts - 카테고리별 카드 데이터 (총 115개)
//
// [키워드 검증 기준]
// - 모든 arasaacKeyword는 ARASAAC API 2중 검증 완료
// - pictogramId: 키워드 검색이 위험/부정확한 경우 ID 직접 지정
// - pictogramUrl: ARASAAC에 없는 한국 고유 항목용 커스텀 SVG
//
// [연구 근거]
// - 김영태 외(2003): 상위 50개 어휘가 전체 의사소통의 58% 차지
// - 박혜연 & 연석정(2020): 90%+ 응답률 필수 어휘
// ========================================

import type { Card, CategoryId } from '../../types';
import { KIMCHI_SVG, FULL_STOMACH_SVG, SIDE_DISH_SVG, RAMEN_SVG, RICE_SVG } from './customPictograms';

export const DEFAULT_CARDS: Record<CategoryId, Card[]> = {

  // ========== 사람 (12) ==========
  person: [
    { id: 'p_me',      text: '나',        category: 'person', arasaacKeyword: '나' },
    { id: 'p_mom',     text: '엄마',      category: 'person', arasaacKeyword: '엄마' },
    { id: 'p_dad',     text: '아빠',      category: 'person', arasaacKeyword: '아빠' },
    { id: 'p_grandma', text: '할머니',    category: 'person', arasaacKeyword: '할머니' },
    { id: 'p_grandpa', text: '할아버지',  category: 'person', arasaacKeyword: '할아버지' },
    { id: 'p_sister',  text: '언니/누나', category: 'person', arasaacKeyword: '누나' },
    { id: 'p_brother', text: '오빠/형',   category: 'person', arasaacKeyword: '형' },
    { id: 'p_younger', text: '동생',      category: 'person', arasaacKeyword: '동생', pictogramId: 2422 },
    // ↑ 형(37967)과 시각 구별을 위해 ID 2422(여동생/자매, AAC인증) 지정
    { id: 'p_teacher', text: '선생님',    category: 'person', arasaacKeyword: '선생님' },
    { id: 'p_friend',  text: '친구',      category: 'person', arasaacKeyword: '친구' },
    { id: 'p_doctor',  text: '의사',      category: 'person', arasaacKeyword: '의사' },
    { id: 'p_family',  text: '가족',      category: 'person', arasaacKeyword: '가족' },
  ],

  // ========== 동작 (20) ==========
  action: [
    { id: 'a_do',     text: '해요',      category: 'action', arasaacKeyword: '활동하다', grammarType: 'verb' },
    // ↑ 수정: "하다" → "활동하다" (하다는 "비누칠하다" 샤워 이미지 반환)
    { id: 'a_go',     text: '가요',      category: 'action', arasaacKeyword: '가다',     grammarType: 'verb' },
    { id: 'a_come',   text: '와요',      category: 'action', arasaacKeyword: '오다',     grammarType: 'verb' },
    // ↑ 검증: ID 16807, AAC인증, "오다/도착하다"
    { id: 'a_see',    text: '봐요',      category: 'action', arasaacKeyword: '보다',     grammarType: 'verb' },
    { id: 'a_give',   text: '줘요',      category: 'action', arasaacKeyword: '주다',     grammarType: 'verb' },
    { id: 'a_eat',    text: '먹어요',    category: 'action', arasaacKeyword: '먹다',     grammarType: 'verb' },
    { id: 'a_drink',  text: '마셔요',    category: 'action', arasaacKeyword: '마시다',   grammarType: 'verb' },
    { id: 'a_sleep',  text: '자요',      category: 'action', arasaacKeyword: '자다',     grammarType: 'verb' },
    { id: 'a_sit',    text: '앉아요',    category: 'action', arasaacKeyword: '앉다',     grammarType: 'verb' },
    { id: 'a_stand',  text: '서요',      category: 'action', arasaacKeyword: '서다',     grammarType: 'verb' },
    { id: 'a_walk',   text: '걸어요',    category: 'action', arasaacKeyword: '걷다',     grammarType: 'verb' },
    { id: 'a_play',   text: '놀아요',    category: 'action', arasaacKeyword: '놀다',     grammarType: 'verb' },
    { id: 'a_wash',   text: '씻어요',    category: 'action', arasaacKeyword: '씻다',     grammarType: 'verb' },
    { id: 'a_wear',   text: '입어요',    category: 'action', arasaacKeyword: '입다',     grammarType: 'verb' },
    { id: 'a_read',   text: '읽어요',    category: 'action', arasaacKeyword: '읽다',     grammarType: 'verb' },
    { id: 'a_make',   text: '만들어요',  category: 'action', arasaacKeyword: '만들다',   grammarType: 'verb' },
    { id: 'a_wait',   text: '기다려요',  category: 'action', arasaacKeyword: '기다리다', grammarType: 'verb' },
    { id: 'a_wakeup', text: '일어나요',  category: 'action', arasaacKeyword: '일어나다', pictogramId: 8152, grammarType: 'verb' },
    // ↑ 수정: ID 8152(일어서다, AAC인증) 지정 - 기본 검색 결과가 잠자는 모습과 유사
    { id: 'a_open',   text: '열어요',    category: 'action', arasaacKeyword: '열다',     grammarType: 'verb' },
    { id: 'a_ride',   text: '타요',      category: 'action', arasaacKeyword: '타다',     grammarType: 'verb' },
  ],

  // ========== 감정 (15) ==========
  feeling: [
    { id: 'f_good',      text: '좋아요',    category: 'feeling', arasaacKeyword: '좋다' },
    { id: 'f_bad',       text: '싫어요',    category: 'feeling', arasaacKeyword: '싫다' },
    { id: 'f_happy',     text: '행복해요',  category: 'feeling', arasaacKeyword: '행복하다' },
    { id: 'f_sad',       text: '슬퍼요',    category: 'feeling', arasaacKeyword: '슬프다' },
    { id: 'f_angry',     text: '화나요',    category: 'feeling', arasaacKeyword: '화나다' },
    { id: 'f_scared',    text: '무서워요',  category: 'feeling', arasaacKeyword: '무섭다' },
    { id: 'f_hurt',      text: '아파요',    category: 'feeling', arasaacKeyword: '아프다' },
    { id: 'f_hungry',    text: '배고파요',  category: 'feeling', arasaacKeyword: '배고프다' },
    { id: 'f_thirsty',   text: '목마르요',  category: 'feeling', arasaacKeyword: '목마르다' },
    { id: 'f_sleepy',    text: '졸려요',    category: 'feeling', pictogramId: 35537 },
    // ⚠️ 위험 수정: "졸리다" 검색 시 "목졸리다"(목 조르다, 범죄) 픽토그램 반환!
    // ID 35537(피곤하다)로 안전하게 대체. 절대 키워드 검색하면 안 됨.
    { id: 'f_tired',     text: '피곤해요',  category: 'feeling', arasaacKeyword: '피곤하다' },
    { id: 'f_bored',     text: '심심해요',  category: 'feeling', arasaacKeyword: '심심하다' },
    { id: 'f_fun',       text: '재밌어요',  category: 'feeling', arasaacKeyword: '재미있다' },
    { id: 'f_okay',      text: '괜찮아요',  category: 'feeling', arasaacKeyword: '괜찮은' },
    // ↑ 수정: "괜찮다" → "괜찮은" (괜찮다는 404, 괜찮은은 ID 5397 AAC인증)
    { id: 'f_surprised', text: '놀랐어요',  category: 'feeling', arasaacKeyword: '놀라다' },
  ],

  // ========== 음식 (15) ==========
  food: [
    { id: 'fd_rice',     text: '밥',        category: 'food', pictogramUrl: RICE_SVG },
    // ↑ 수정: "밥" 404. 커스텀 SVG (밥그릇+젓가락)
    { id: 'fd_bread',    text: '빵',        category: 'food', arasaacKeyword: '빵' },
    { id: 'fd_soup',     text: '국',        category: 'food', arasaacKeyword: '수프' },
    // ↑ 수정: "국" 404 → "수프" (ID 2573, AAC인증)
    { id: 'fd_meat',     text: '고기',      category: 'food', arasaacKeyword: '고기' },
    { id: 'fd_sidedish', text: '반찬',      category: 'food', pictogramUrl: SIDE_DISH_SVG },
    // ↑ 수정: "반찬" 404. 커스텀 SVG (작은 접시 여러 개)
    { id: 'fd_fruit',    text: '과일',      category: 'food', arasaacKeyword: '과일' },
    { id: 'fd_kimchi',   text: '김치',      category: 'food', pictogramUrl: KIMCHI_SVG },
    // ↑ 수정: "김치" 404. 커스텀 SVG (김치 항아리)
    { id: 'fd_noodle',   text: '라면',      category: 'food', pictogramUrl: RAMEN_SVG },
    // ↑ 수정: "라면" 404. 커스텀 SVG (라면 그릇). "국수"(ID 8584)도 가능하나 더 정확한 표현 위해 커스텀
    { id: 'fd_egg',      text: '계란',      category: 'food', arasaacKeyword: '계란' },
    { id: 'fd_snack',    text: '과자',      category: 'food', arasaacKeyword: '과자' },
    { id: 'fd_water',    text: '물',        category: 'food', arasaacKeyword: '물' },
    { id: 'fd_milk',     text: '우유',      category: 'food', arasaacKeyword: '우유' },
    { id: 'fd_juice',    text: '주스',      category: 'food', arasaacKeyword: '주스' },
    { id: 'fd_yummy',    text: '맛있어요',  category: 'food', arasaacKeyword: '맛있다' },
    { id: 'fd_full',     text: '배불러요',  category: 'food', pictogramUrl: FULL_STOMACH_SVG },
    // ↑ 수정: "배부르다" 404, "배" 검색 시 배(船) 반환! 커스텀 SVG로 대체
  ],

  // ========== 장소 (10) ==========
  place: [
    { id: 'pl_home',       text: '집',     category: 'place', arasaacKeyword: '집' },
    { id: 'pl_school',     text: '학교',   category: 'place', arasaacKeyword: '학교' },
    { id: 'pl_hospital',   text: '병원',   category: 'place', arasaacKeyword: '병원' },
    { id: 'pl_toilet',     text: '화장실', category: 'place', arasaacKeyword: '화장실' },
    { id: 'pl_mart',       text: '마트',   category: 'place', arasaacKeyword: '마트' },
    // ↑ 수정: "슈퍼마켓" → "마트" (ID 32942, AAC인증, 카드 텍스트와 일치)
    { id: 'pl_park',       text: '공원',   category: 'place', arasaacKeyword: '놀이터' },
    // ↑ 수정: "공원" → "놀이터" (공원은 스페인 특정공원 반환, 놀이터 ID 2859 AAC인증)
    { id: 'pl_restaurant', text: '식당',   category: 'place', arasaacKeyword: '식당' },
    { id: 'pl_room',       text: '방',     category: 'place', arasaacKeyword: '침실' },
    // ↑ 수정: "방" → "침실" (방은 빈 키워드 반환, 침실 ID 5988 AAC인증)
    { id: 'pl_outside',    text: '밖',     category: 'place', arasaacKeyword: '밖에' },
    // ↑ 수정: "밖" 404 → "밖에" (ID 5475, AAC인증)
    { id: 'pl_car',        text: '차',     category: 'place', arasaacKeyword: '자동차' },
  ],

  // ========== 사물 (12) ==========
  thing: [
    { id: 'th_clothes',  text: '옷',      category: 'thing', arasaacKeyword: '옷' },
    { id: 'th_shoes',    text: '신발',    category: 'thing', arasaacKeyword: '신발' },
    { id: 'th_bag',      text: '가방',    category: 'thing', arasaacKeyword: '가방' },
    { id: 'th_phone',    text: '핸드폰',  category: 'thing', arasaacKeyword: '휴대폰' },
    // ↑ 수정: "휴대전화" 404 → "휴대폰" (ID 25269, AAC인증)
    { id: 'th_tv',       text: 'TV',      category: 'thing', arasaacKeyword: '텔레비전' },
    { id: 'th_book',     text: '책',      category: 'thing', arasaacKeyword: '책' },
    { id: 'th_medicine', text: '약',      category: 'thing', arasaacKeyword: '약' },
    { id: 'th_blanket',  text: '이불',    category: 'thing', arasaacKeyword: '이불' },
    { id: 'th_tissue',   text: '휴지',    category: 'thing', arasaacKeyword: '휴지' },
    { id: 'th_toy',      text: '장난감',  category: 'thing', arasaacKeyword: '장난감' },
    { id: 'th_ball',     text: '공',      category: 'thing', arasaacKeyword: '공' },
    { id: 'th_cup',      text: '컵',      category: 'thing', arasaacKeyword: '컵' },
  ],

  // ========== 시간 (10) - 시제/시점 전용 ==========
  time: [
    { id: 'tm_now',       text: '지금',    category: 'time', arasaacKeyword: '지금' },
    { id: 'tm_later',     text: '나중에',  category: 'time', arasaacKeyword: '나중에' },
    { id: 'tm_today',     text: '오늘',    category: 'time', arasaacKeyword: '오늘' },
    { id: 'tm_tomorrow',  text: '내일',    category: 'time', arasaacKeyword: '내일' },
    { id: 'tm_yesterday', text: '어제',    category: 'time', arasaacKeyword: '어제' },
    { id: 'tm_soon',      text: '곧',      category: 'time', arasaacKeyword: '지금' },
    // "곧" ARASAAC 404 → "지금"(ID 32747) 대체 사용
    { id: 'tm_morning',   text: '아침',    category: 'time', arasaacKeyword: '아침' },
    { id: 'tm_evening',   text: '저녁',    category: 'time', arasaacKeyword: '져녁식사' },
    // "저녁" 404 → "져녁식사"(저녁식사, ID 4592 AAC인증) 사용
    { id: 'tm_always',    text: '항상',    category: 'time', arasaacKeyword: '항상' },
    { id: 'tm_sometimes', text: '가끔',    category: 'time', arasaacKeyword: '나중에' },
    // "가끔" 404 → "나중에"(ID 32749) 대체 (완전 일치는 아니지만 시간 개념으로 가장 근접)
  ],

  // ========== 표현 (20) - 의사소통 표현 + 인사 ==========
  expression: [
    // 응답
    { id: 'ex_yes',    text: '네',       category: 'expression', arasaacKeyword: '네' },
    { id: 'ex_no',     text: '아니요',   category: 'expression', arasaacKeyword: '아니' },
    // ↑ 수정: "아니요" 404 → "아니" (ID 31859, 거절/부정)
    // 인사 (시간 카테고리에서 이동)
    { id: 'ex_hello',   text: '안녕',      category: 'expression', arasaacKeyword: '안녕' },
    { id: 'ex_thanks',  text: '고마워요',  category: 'expression', arasaacKeyword: '감사합니다' },
    // ⚠️ 수정: "감사하다" → "감사합니다" (감사하다는 "회계 감사" 반환! ID 8129 AAC인증)
    { id: 'ex_sorry',   text: '미안해요',  category: 'expression', arasaacKeyword: '미안해' },
    // ↑ 수정: "미안하다" 404 → "미안해" (ID 11625, AAC인증)
    { id: 'ex_night',   text: '잘자',      category: 'expression', arasaacKeyword: '잘자' },
    // ↑ 수정: "잘자다" 404 → "잘자" (ID 6942)
    // 요청
    { id: 'ex_want',   text: '원해요',   category: 'expression', arasaacKeyword: '원하다' },
    { id: 'ex_need',   text: '필요해요', category: 'expression', arasaacKeyword: '필요하다' },
    { id: 'ex_please', text: '주세요',   category: 'expression', pictogramId: 28431 },
    // ↑ 수정: "주세요" 검색 시 "도와주세요"(도움) 반환! ID 28431(주다, AAC인증) 직접 지정
    { id: 'ex_wait',   text: '잠깐만요', category: 'expression', arasaacKeyword: '기다리다' },
    // 수식
    { id: 'ex_more',   text: '더',       category: 'expression', arasaacKeyword: '더' },
    { id: 'ex_not',    text: '안',       category: 'expression', arasaacKeyword: '아니다' },
    { id: 'ex_again',  text: '또',       category: 'expression', arasaacKeyword: '다시' },
    // ↑ 수정: "또" 검색 시 "잘가, 또 만나"(작별인사) 반환! "다시"(ID 37163) 사용
    { id: 'ex_alot',   text: '많이',     category: 'expression', arasaacKeyword: '많이' },
    // ↑ 수정: "많다" → "많이" (많다는 "욕심이 많다"=탐욕 반환! 많이는 ID 5521 정상)
    { id: 'ex_fast',   text: '빨리',     category: 'expression', arasaacKeyword: '빠르다' },
    // ↑ 수정: "빨리" 404 → "빠르다" (ID 5306)
    // 의문
    { id: 'ex_what',   text: '뭐',       category: 'expression', arasaacKeyword: '무엇' },
    { id: 'ex_where',  text: '어디',     category: 'expression', arasaacKeyword: '어디' },
    { id: 'ex_who',    text: '누구',     category: 'expression', arasaacKeyword: '누구' },
    { id: 'ex_why',    text: '왜',       category: 'expression', arasaacKeyword: '왜' },
    { id: 'ex_and',    text: '그리고',   category: 'expression', arasaacKeyword: '그리고' },
  ],
};
