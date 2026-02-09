/* ========================================
   cards.js - 카드 데이터
   연구 기반 완전 개편 (김영태 외 2003, 박혜연 & 연석정 2020)
   
   [연구 근거]
   - 김영태 외(2003): 상위 50개 어휘가 전체의 58% 차지
   - 구조어(대명사, 접속사) 35% : 내용어(명사, 동사) 65% 비율
   - 박혜연 & 연석정(2020): 90%+ 응답률 필수 어휘 포함
   - 응답형 어휘(네/아니오) 83% 응답률
   - 인사/사회어 87% 응답률
   - 개인어휘가 NDW의 74% 차지
======================================== */

// 긴급 카드 목록 (상단 고정) - 연구 기반 확장
// 박혜연 & 연석정(2020): 90%+ 응답률 어휘 포함
export const EMERGENCY_CARDS = [
    { id: 'em1', text: '도와주세요', pictogram: 'help', category: 'need', priority: 1 },
    { id: 'em2', text: '아파요', pictogram: 'pain', category: 'feeling', priority: 1 },
    { id: 'em3', text: '화장실 가요', pictogram: 'toilet', category: 'need', priority: 1 },
    { id: 'em4', text: '쉬 마려워요', pictogram: 'pee', category: 'need', priority: 2 },
    { id: 'em5', text: '응가 마려워요', pictogram: 'poop', category: 'need', priority: 2 },
    { id: 'em6', text: '물 주세요', pictogram: 'water-request', category: 'food', priority: 2 },
    { id: 'em7', text: '무서워요', pictogram: 'scared', category: 'feeling', priority: 2 },
    { id: 'em8', text: '그만해요', pictogram: 'stop', category: 'need', priority: 1 }
];

// 기본 카테고리 목록 - 연구 기반 재구성
// 김영태 외(2003): 구조어와 내용어 균형 중요
// 이정은 & 박은혜(2000): 상황별 어휘판 필요
export const DEFAULT_CATEGORIES = [
    { id: 'core', name: '핵심어' },
    { id: 'greeting', name: '인사' },
    { id: 'person', name: '사람' },
    { id: 'feeling', name: '감정' },
    { id: 'food', name: '먹기' },
    { id: 'action', name: '활동' },
    { id: 'place', name: '장소' },
    { id: 'thing', name: '사물' },
    { id: 'time', name: '시간' },
    { id: 'hospital', name: '병원' },
    { id: 'school', name: '학교' }
];

// 카테고리별 아이콘 (SVG)
export const CATEGORY_ICONS = {
    core: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    greeting: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 11v-1a5 5 0 0 1 10 0v1"/><path d="M5 19a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2"/><path d="M12 19v3"/></svg>`,
    person: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    feeling: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
    food: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    action: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    place: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    thing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
    time: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    hospital: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>`,
    school: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`
};

// 동사별 추천 단어 매핑
export const VERB_SUGGESTIONS = {
    'c_go': {
        suggestions: [
            { text: '집', category: 'place', id: 'pl1' },
            { text: '병원', category: 'place', id: 'pl6' },
            { text: '학교', category: 'place', id: 'pl4' },
            { text: '화장실', category: 'place', id: 'pl3' },
            { text: '밖', category: 'place', id: 'pl10' }
        ]
    },
    'c_come': {
        suggestions: [
            { text: '엄마', category: 'person', id: 'pe2' },
            { text: '아빠', category: 'person', id: 'pe3' },
            { text: '선생님', category: 'person', id: 'pe10' },
            { text: '여기', category: 'place', id: 'pl11' }
        ]
    },
    'c_eat': {
        suggestions: [
            { text: '밥', category: 'food', id: 'fo1' },
            { text: '빵', category: 'food', id: 'fo2' },
            { text: '과일', category: 'food', id: 'fo6' },
            { text: '과자', category: 'food', id: 'fo10' }
        ]
    },
    'c_drink': {
        suggestions: [
            { text: '물', category: 'food', id: 'fo7' },
            { text: '우유', category: 'food', id: 'fo8' },
            { text: '주스', category: 'food', id: 'fo9' }
        ]
    },
    'c_give': {
        suggestions: [
            { text: '물', category: 'food', id: 'fo7' },
            { text: '밥', category: 'food', id: 'fo1' },
            { text: '약', category: 'thing', id: 'th_med' }
        ]
    },
    'c_see': {
        suggestions: [
            { text: 'TV', category: 'thing', id: 'th_tv' },
            { text: '책', category: 'thing', id: 'th_book' },
            { text: '엄마', category: 'person', id: 'pe2' }
        ]
    },
    'act_play': {
        suggestions: [
            { text: '친구', category: 'person', id: 'pe11' },
            { text: '장난감', category: 'thing', id: 'th_toy' },
            { text: '공원', category: 'place', id: 'pl9' }
        ]
    },
    'act_sleep': {
        suggestions: [
            { text: '지금', category: 'time', id: 't1' },
            { text: '밤', category: 'time', id: 't6' },
            { text: '방', category: 'place', id: 'pl2' }
        ]
    },
    'fo_moreeat': {
        suggestions: [
            { text: '밥', category: 'food', id: 'fo1' },
            { text: '물', category: 'food', id: 'fo7' },
            { text: '반찬', category: 'food', id: 'fo5' }
        ]
    }
};

// ========================================
// 기본 카드 데이터 - 연구 기반 전면 개편
// ========================================

export const DEFAULT_CARDS = {
    // ★ 핵심어 카테고리 - 김영태 외(2003) 기반 대폭 확장
    // 연구 근거: 구조어 35% : 내용어 65% 비율 준수
    // 상위 50개 어휘가 전체의 58% 차지
    core: [
        // === 대명사 (8개) - 김영태(2003) 고빈도 ===
        { id: 'c_i', text: '나', pictogram: 'i-me', grammarType: 'pronoun' },
        { id: 'c_you', text: '너', pictogram: 'you', grammarType: 'pronoun' },
        { id: 'c_we', text: '우리', pictogram: 'we', grammarType: 'pronoun' },
        { id: 'c_this', text: '이거', pictogram: 'this', grammarType: 'pronoun' },
        { id: 'c_that', text: '저거', pictogram: 'that', grammarType: 'pronoun' },
        { id: 'c_here', text: '여기', pictogram: 'here', grammarType: 'pronoun' },
        { id: 'c_there', text: '거기', pictogram: 'there', grammarType: 'pronoun' },
        { id: 'c_what', text: '뭐', pictogram: 'what-thing', grammarType: 'pronoun' },
        
        // === 조사 (10개) - 김영태(2003): 구조어의 핵심 ===
        // 한국어 AAC에서 가장 중요한 구조어
        { id: 'c_subj', text: '~이/가', pictogram: 'particle-subj', grammarType: 'particle' },
        { id: 'c_obj', text: '~을/를', pictogram: 'particle-obj', grammarType: 'particle' },
        { id: 'c_to', text: '~에', pictogram: 'particle-to', grammarType: 'particle' },
        { id: 'c_at', text: '~에서', pictogram: 'particle-at', grammarType: 'particle' },
        { id: 'c_with', text: '~하고', pictogram: 'particle-with', grammarType: 'particle' },
        { id: 'c_poss', text: '~의', pictogram: 'particle-poss', grammarType: 'particle' },
        { id: 'c_also', text: '~도', pictogram: 'particle-also', grammarType: 'particle' },
        { id: 'c_only', text: '~만', pictogram: 'particle-only', grammarType: 'particle' },
        { id: 'c_from', text: '~부터', pictogram: 'particle-from', grammarType: 'particle' },
        { id: 'c_until', text: '~까지', pictogram: 'particle-until', grammarType: 'particle' },
        
        // === 응답형 어휘 (8개) - 김영태(2003): 83% 응답률 ===
        { id: 'c_yes', text: '네', pictogram: 'yes', grammarType: 'response' },
        { id: 'c_no', text: '아니요', pictogram: 'no', grammarType: 'response' },
        { id: 'c_yup', text: '응', pictogram: 'yup', grammarType: 'response' },
        { id: 'c_nope', text: '아니', pictogram: 'nope', grammarType: 'response' },
        { id: 'c_ok', text: '그래', pictogram: 'ok', grammarType: 'response' },
        { id: 'c_maybe', text: '아마', pictogram: 'maybe', grammarType: 'response' },
        { id: 'c_really', text: '진짜?', pictogram: 'really', grammarType: 'response' },
        
        // === 접속사 (6개) - 김영태(2003): 고빈도 17위 '그런데' 등 ===
        { id: 'c_and', text: '그리고', pictogram: 'and', grammarType: 'conjunction' },
        { id: 'c_but', text: '그런데', pictogram: 'but', grammarType: 'conjunction' },
        { id: 'c_so', text: '그래서', pictogram: 'so', grammarType: 'conjunction' },
        { id: 'c_then', text: '그러면', pictogram: 'then', grammarType: 'conjunction' },
        { id: 'c_because', text: '왜냐하면', pictogram: 'because', grammarType: 'conjunction' },
        { id: 'c_or', text: '아니면', pictogram: 'or', grammarType: 'conjunction' },
        
        // === 핵심 동사 (10개) - 고빈도 순 ===
        { id: 'c_do', text: '해요', pictogram: 'do', grammarType: 'verb' },
        { id: 'c_go', text: '가요', pictogram: 'go', grammarType: 'verb' },
        { id: 'c_come', text: '와요', pictogram: 'come', grammarType: 'verb' },
        { id: 'c_see', text: '봐요', pictogram: 'see', grammarType: 'verb' },
        { id: 'c_give', text: '줘요', pictogram: 'give', grammarType: 'verb' },
        { id: 'c_eat', text: '먹어요', pictogram: 'eat', grammarType: 'verb' },
        { id: 'c_drink', text: '마셔요', pictogram: 'drink', grammarType: 'verb' },
        { id: 'c_exist', text: '있어요', pictogram: 'exist', grammarType: 'verb' },
        { id: 'c_notexist', text: '없어요', pictogram: 'not-exist', grammarType: 'verb' },
        { id: 'c_want', text: '원해요', pictogram: 'want', grammarType: 'verb' },
        
        // === 신상은 & 박다은(2020) 33개 공통 핵심어휘 추가 ===
        // 논문: "다양한 연령대에 걸쳐 공통적으로 나타난 핵심어휘는 총 33개"
        { id: 'c_become', text: '돼요', pictogram: 'become', grammarType: 'verb' },
        { id: 'c_goout', text: '나가요', pictogram: 'go-out', grammarType: 'verb' },
        { id: 'c_have', text: '가져요', pictogram: 'have', grammarType: 'verb' },
        { id: 'c_comeout', text: '나와요', pictogram: 'come-out', grammarType: 'verb' },
        { id: 'c_put', text: '놔요', pictogram: 'put', grammarType: 'verb' },
        { id: 'c_receive', text: '받아요', pictogram: 'receive', grammarType: 'verb' },
        { id: 'c_know', text: '알아요', pictogram: 'know', grammarType: 'verb' },
        { id: 'c_dontknow', text: '몰라요', pictogram: 'dont-know', grammarType: 'verb' },
        { id: 'c_same', text: '같아요', pictogram: 'same', grammarType: 'verb' },
        { id: 'c_okay', text: '괜찮아요', pictogram: 'okay', grammarType: 'verb' },
        { id: 'c_big', text: '커요', pictogram: 'big', grammarType: 'adjective' },
        { id: 'c_lots', text: '많아요', pictogram: 'lots', grammarType: 'adjective' },
        
        // === 부사/부정어 (8개) ===
        { id: 'c_not', text: '안', pictogram: 'not', grammarType: 'adverb' },
        { id: 'c_again', text: '또', pictogram: 'again', grammarType: 'adverb' },
        { id: 'c_more', text: '더', pictogram: 'more', grammarType: 'adverb' },
        { id: 'c_many', text: '많이', pictogram: 'many', grammarType: 'adverb' },
        { id: 'c_little', text: '조금', pictogram: 'little', grammarType: 'adverb' },
        { id: 'c_fast', text: '빨리', pictogram: 'fast', grammarType: 'adverb' },
        { id: 'c_slow', text: '천천히', pictogram: 'slow', grammarType: 'adverb' },
        { id: 'c_well', text: '잘', pictogram: 'well', grammarType: 'adverb' },
        { id: 'c_just', text: '그냥', pictogram: 'just', grammarType: 'adverb' },
        { id: 'c_thing', text: '것', pictogram: 'thing', grammarType: 'pronoun' },
        
        // === 추가 구조어 (김영태 2003 권장) ===
        // 추가 조사
        { id: 'c_give_to', text: '~한테', pictogram: 'particle-give', grammarType: 'particle' },
        { id: 'c_like', text: '~처럼', pictogram: 'particle-like', grammarType: 'particle' },
        { id: 'c_about', text: '~보다', pictogram: 'particle-than', grammarType: 'particle' },
        { id: 'c_for', text: '~위해', pictogram: 'particle-for', grammarType: 'particle' },
        
        // 추가 대명사/지시어
        { id: 'c_everyone', text: '다', pictogram: 'everyone', grammarType: 'pronoun' },
        { id: 'c_who', text: '누구', pictogram: 'who', grammarType: 'pronoun' },
        { id: 'c_when', text: '언제', pictogram: 'when', grammarType: 'pronoun' },
        { id: 'c_where', text: '어디', pictogram: 'where', grammarType: 'pronoun' },
        { id: 'c_how', text: '어떻게', pictogram: 'how', grammarType: 'pronoun' },
        { id: 'c_why', text: '왜', pictogram: 'why', grammarType: 'pronoun' },
        
        // 추가 응답어
        { id: 'c_wait', text: '잠깐', pictogram: 'wait', grammarType: 'response' },
        { id: 'c_hmm', text: '글쎄', pictogram: 'hmm', grammarType: 'response' },
        { id: 'c_sure', text: '당연', pictogram: 'sure', grammarType: 'response' },
        { id: 'c_right', text: '맞아', pictogram: 'right', grammarType: 'response' },
        { id: 'c_wow', text: '와', pictogram: 'wow', grammarType: 'response' },
        { id: 'c_oops', text: '앗', pictogram: 'oops', grammarType: 'response' },
        { id: 'give-me', text: '주세요', pictogram: 'give-me', category: 'core', grammarType: 'verb' },
        { id: 'dont-want', text: '싫어요', pictogram: 'dont-want', category: 'core', grammarType: 'adjective' },
        { id: 'like-it', text: '좋아요', pictogram: 'like-it', category: 'core', grammarType: 'adjective' },
        { id: 'lets-do', text: '하자', pictogram: 'lets-do', category: 'core', grammarType: 'verb' },
        { id: 'stop-it', text: '그만', pictogram: 'stop-it', category: 'core', grammarType: 'adverb' },
        { id: 'wait-core', text: '기다려', pictogram: 'wait-core', category: 'core', grammarType: 'verb' },
        { id: 'need-it', text: '필요해요', pictogram: 'need-it', category: 'core', grammarType: 'adjective' },
        { id: 'finished', text: '다 했어요', pictogram: 'finished', category: 'core', grammarType: 'verb' },
        { id: 'help-core', text: '도와줘', pictogram: 'help-core', category: 'core', grammarType: 'verb' },
        { id: 'go-there', text: '가자', pictogram: 'go-there', category: 'core', grammarType: 'verb' },
        { id: 'together', text: '같이', pictogram: 'together', category: 'core', grammarType: 'adverb' },
        { id: 'alone', text: '혼자', pictogram: 'alone', category: 'core', grammarType: 'adverb' },
    ],

    // ★ 인사/사회어 카테고리 (새로 추가)
    // 박혜연 & 연석정(2020): 사회어/인사어 87% 응답률
    greeting: [
        // 인사 (87% 응답률)
        { id: 'gr_hi', text: '안녕', pictogram: 'hello', grammarType: 'greeting' },
        { id: 'gr_bye', text: '잘가', pictogram: 'bye', grammarType: 'greeting' },
        { id: 'gr_goodnight', text: '잘자', pictogram: 'goodnight', grammarType: 'greeting' },
        
        // 감사/사과 (80% 응답률)
        { id: 'gr_thanks', text: '고마워요', pictogram: 'thanks', grammarType: 'greeting' },
        { id: 'gr_sorry', text: '미안해요', pictogram: 'sorry', grammarType: 'greeting' },
        { id: 'gr_please', text: '제발', pictogram: 'please', grammarType: 'greeting' },
        
        // 호칭/부름
        { id: 'gr_wait', text: '잠깐만요', pictogram: 'wait-please', grammarType: 'greeting' },
        { id: 'gr_excuse', text: '저기요', pictogram: 'excuse', grammarType: 'greeting' },
        
        // 질문형 (70% 응답률)
        { id: 'gr_why', text: '왜요?', pictogram: 'why', grammarType: 'question' },
        { id: 'gr_what', text: '뭐예요?', pictogram: 'what', grammarType: 'question' },
        { id: 'gr_where', text: '어디예요?', pictogram: 'where', grammarType: 'question' },
        { id: 'gr_when', text: '언제요?', pictogram: 'when', grammarType: 'question' },
        
        // 허락/요청
        { id: 'gr_canI', text: '해도 돼요?', pictogram: 'can-i', grammarType: 'question' },
        { id: 'gr_helpme', text: '도와주세요', pictogram: 'help-please', grammarType: 'request' }
    ],

    // ★ 사람 카테고리 - 연구 기반 확장
    // 박혜연 & 연석정(2020): 가족 90% 응답률
    person: [
        // 직계 가족 (90%+ 응답률)
        { id: 'pe1', text: '나', pictogram: 'self', grammarType: 'subject' },
        { id: 'pe2', text: '엄마', pictogram: 'mom', grammarType: 'subject' },
        { id: 'pe3', text: '아빠', pictogram: 'dad', grammarType: 'subject' },
        { id: 'pe4', text: '할머니', pictogram: 'grandma', grammarType: 'subject' },
        { id: 'pe5', text: '할아버지', pictogram: 'grandpa', grammarType: 'subject' },
        
        // 형제 (57% 응답률)
        { id: 'pe6', text: '언니/누나', pictogram: 'older-sister', grammarType: 'subject' },
        { id: 'pe7', text: '오빠/형', pictogram: 'older-brother', grammarType: 'subject' },
        { id: 'pe8', text: '동생', pictogram: 'sibling', grammarType: 'subject' },
        { id: 'pe9', text: '아기', pictogram: 'baby', grammarType: 'subject' },
        
        // 사회 관계
        { id: 'pe10', text: '선생님', pictogram: 'teacher', grammarType: 'subject' },
        { id: 'pe11', text: '친구', pictogram: 'friend', grammarType: 'subject' },
        { id: 'pe12', text: '의사', pictogram: 'doctor-person', grammarType: 'subject' },
        { id: 'pe13', text: '간호사', pictogram: 'nurse', grammarType: 'subject' },
        { id: 'family', text: '가족', pictogram: 'family', category: 'person', grammarType: 'noun' },
        { id: 'people', text: '사람들', pictogram: 'people', category: 'person', grammarType: 'noun' },
    ],

    // ★ 감정 카테고리 - 연구 기반 확장
    // 박혜연 & 연석정(2020): 기분/감정 83%+ 응답률
    feeling: [
        // 긍정 감정
        { id: 'f1', text: '좋아요', pictogram: 'happy', grammarType: 'verb' },
        { id: 'f2', text: '행복해요', pictogram: 'joyful', grammarType: 'verb' },
        { id: 'f3', text: '신나요', pictogram: 'excited', grammarType: 'verb' },
        { id: 'f4', text: '편해요', pictogram: 'comfortable', grammarType: 'verb' },
        
        // 부정 감정
        { id: 'f5', text: '싫어요', pictogram: 'dislike', grammarType: 'verb' },
        { id: 'f6', text: '슬퍼요', pictogram: 'sad', grammarType: 'verb' },
        { id: 'f7', text: '화나요', pictogram: 'angry', grammarType: 'verb' },
        { id: 'f8', text: '무서워요', pictogram: 'scared', grammarType: 'verb' },
        { id: 'f9', text: '짜증나요', pictogram: 'annoyed', grammarType: 'verb' },
        
        // 신체 상태 (90%+ 응답률)
        { id: 'f10', text: '배고파요', pictogram: 'hungry', grammarType: 'verb' },
        { id: 'f11', text: '목마르요', pictogram: 'thirsty', grammarType: 'verb' },
        { id: 'f12', text: '졸려요', pictogram: 'sleepy', grammarType: 'verb' },
        { id: 'f13', text: '피곤해요', pictogram: 'tired', grammarType: 'verb' },
        { id: 'f14', text: '아파요', pictogram: 'pain', grammarType: 'verb' },
        { id: 'f15', text: '가려워요', pictogram: 'itchy', grammarType: 'verb' },
        
        // 기타 감정
        { id: 'f16', text: '심심해요', pictogram: 'bored', grammarType: 'verb' },
        { id: 'f17', text: '걱정돼요', pictogram: 'worried', grammarType: 'verb' },
        { id: 'f18', text: '부끄러워요', pictogram: 'shy', grammarType: 'verb' },
        { id: 'love-it', text: '좋아해요', pictogram: 'love-it', category: 'feeling', grammarType: 'verb' },
        { id: 'hate-it', text: '싫어해요', pictogram: 'hate-it', category: 'feeling', grammarType: 'verb' },
        { id: 'fun', text: '재밌어요', pictogram: 'fun', category: 'feeling', grammarType: 'adjective' },
        { id: 'boring', text: '지루해요', pictogram: 'boring', category: 'feeling', grammarType: 'adjective' },
        { id: 'surprise', text: '놀랐어요', pictogram: 'surprise', category: 'feeling', grammarType: 'verb' },
        { id: 'lonely', text: '외로워요', pictogram: 'lonely', category: 'feeling', grammarType: 'adjective' },
    ],

    // ★ 먹기 카테고리 (음식 + 동작/상태)
    food: [
        // 주식 (90%+ 응답률)
        { id: 'fo1', text: '밥', pictogram: 'rice', grammarType: 'object' },
        { id: 'fo2', text: '빵', pictogram: 'bread', grammarType: 'object' },
        { id: 'fo3', text: '국', pictogram: 'soup', grammarType: 'object' },
        { id: 'fo4', text: '고기', pictogram: 'meat', grammarType: 'object' },
        { id: 'fo5', text: '반찬', pictogram: 'side-dish', grammarType: 'object' },
        { id: 'fo6', text: '과일', pictogram: 'fruit', grammarType: 'object' },
        
        // 음료 (83%+ 응답률)
        { id: 'fo7', text: '물', pictogram: 'water-drink', grammarType: 'object' },
        { id: 'fo8', text: '우유', pictogram: 'milk', grammarType: 'object' },
        { id: 'fo9', text: '주스', pictogram: 'juice', grammarType: 'object' },
        
        // 간식
        { id: 'fo10', text: '과자', pictogram: 'snack', grammarType: 'object' },
        { id: 'fo11', text: '아이스크림', pictogram: 'icecream', grammarType: 'object' },
        { id: 'fo12', text: '사탕', pictogram: 'candy', grammarType: 'object' },
        
        // 동작/상태
        { id: 'fo_eat', text: '먹어요', pictogram: 'eat', grammarType: 'verb' },
        { id: 'fo_drink', text: '마셔요', pictogram: 'drink', grammarType: 'verb' },
        { id: 'fo_hot', text: '뜨거워요', pictogram: 'hot-food', grammarType: 'verb' },
        { id: 'fo_cold', text: '차가워요', pictogram: 'cold-food', grammarType: 'verb' },
        { id: 'fo_yummy', text: '맛있어요', pictogram: 'yummy', grammarType: 'verb' },
        { id: 'fo_full', text: '배불러요', pictogram: 'full', grammarType: 'verb' },
        { id: 'fo_noteat', text: '안 먹을래요', pictogram: 'not-eat', grammarType: 'verb' },
        { id: 'fo_moreeat', text: '더 주세요', pictogram: 'more-food', grammarType: 'verb' },
        { id: 'rice-cake', text: '떡', pictogram: 'rice-cake', category: 'food', grammarType: 'noun' },
        { id: 'noodle', text: '라면', pictogram: 'noodle', category: 'food', grammarType: 'noun' },
        { id: 'egg', text: '계란', pictogram: 'egg', category: 'food', grammarType: 'noun' },
        { id: 'kimchi', text: '김치', pictogram: 'kimchi', category: 'food', grammarType: 'noun' },
        { id: 'chicken', text: '치킨', pictogram: 'chicken-food', category: 'food', grammarType: 'noun' },
        { id: 'banana', text: '바나나', pictogram: 'banana', category: 'food', grammarType: 'noun' },
        { id: 'tea', text: '차', pictogram: 'tea', category: 'food', grammarType: 'noun' },
        { id: 'chocolate', text: '초콜릿', pictogram: 'chocolate', category: 'food', grammarType: 'noun' },
    ],

    // ★ 활동 카테고리 - 일상생활 동작
    action: [
        // 기본 동작
        { id: 'act_sit', text: '앉아요', pictogram: 'sit', grammarType: 'verb' },
        { id: 'act_stand', text: '서요', pictogram: 'stand', grammarType: 'verb' },
        { id: 'act_walk', text: '걸어요', pictogram: 'walk', grammarType: 'verb' },
        { id: 'act_run', text: '뛰어요', pictogram: 'run', grammarType: 'verb' },
        { id: 'act_sleep', text: '자요', pictogram: 'sleep', grammarType: 'verb' },
        { id: 'act_wakeup', text: '일어나요', pictogram: 'wake-up', grammarType: 'verb' },
        
        // 위생 활동 (87%+ 응답률)
        { id: 'act_brush', text: '양치해요', pictogram: 'brush-teeth', grammarType: 'verb' },
        { id: 'act_wash', text: '씻어요', pictogram: 'wash', grammarType: 'verb' },
        { id: 'act_shower', text: '목욕해요', pictogram: 'shower', grammarType: 'verb' },
        
        // 옷 관련 (73%+ 응답률)
        { id: 'act_dress', text: '입어요', pictogram: 'dress', grammarType: 'verb' },
        { id: 'act_undress', text: '벗어요', pictogram: 'undress', grammarType: 'verb' },
        { id: 'act_puton', text: '신어요', pictogram: 'put-on-shoes', grammarType: 'verb' },
        
        // 놀이/학습
        { id: 'act_play', text: '놀아요', pictogram: 'play', grammarType: 'verb' },
        { id: 'act_draw', text: '그려요', pictogram: 'draw', grammarType: 'verb' },
        { id: 'act_sing', text: '노래해요', pictogram: 'sing', grammarType: 'verb' },
        { id: 'act_read', text: '읽어요', pictogram: 'read', grammarType: 'verb' },
        { id: 'act_tidy', text: '정리해요', pictogram: 'tidy', grammarType: 'verb' },
        
        // 대기/사회
        { id: 'act_wait', text: '기다려요', pictogram: 'wait', grammarType: 'verb' },
        { id: 'act_greet', text: '인사해요', pictogram: 'greet', grammarType: 'verb' },
        { id: 'act_hug', text: '안아줘요', pictogram: 'hug', grammarType: 'verb' },
        { id: 'watch-tv', text: 'TV 봐요', pictogram: 'watch-tv', category: 'action', grammarType: 'verb' },
        { id: 'listen-music', text: '음악 들어요', pictogram: 'listen-music', category: 'action', grammarType: 'verb' },
        { id: 'open-it', text: '열어요', pictogram: 'open-it', category: 'action', grammarType: 'verb' },
        { id: 'close-it', text: '닫아요', pictogram: 'close-it', category: 'action', grammarType: 'verb' },
        { id: 'turn-on', text: '켜요', pictogram: 'turn-on', category: 'action', grammarType: 'verb' },
        { id: 'turn-off', text: '꺼요', pictogram: 'turn-off', category: 'action', grammarType: 'verb' },
        { id: 'throw-it', text: '버려요', pictogram: 'throw-it', category: 'action', grammarType: 'verb' },
        { id: 'make-it', text: '만들어요', pictogram: 'make-it', category: 'action', grammarType: 'verb' },
    ],

    // ★ 장소 카테고리 - 연구 기반 + 교통수단 추가
    // 김영태 외(2003): 9가지 상황별 장소
    // 박혜연 & 연석정(2020): 교통수단 80% 응답률
    place: [
        // 가정 환경
        { id: 'pl1', text: '집', pictogram: 'home', grammarType: 'place' },
        { id: 'pl2', text: '방', pictogram: 'room', grammarType: 'place' },
        { id: 'pl3', text: '화장실', pictogram: 'restroom', grammarType: 'place' },
        
        // 교육 환경
        { id: 'pl4', text: '학교', pictogram: 'school', grammarType: 'place' },
        { id: 'pl5', text: '어린이집', pictogram: 'daycare', grammarType: 'place' },
        
        // 지역사회
        { id: 'pl6', text: '병원', pictogram: 'hospital', grammarType: 'place' },
        { id: 'pl7', text: '마트', pictogram: 'store', grammarType: 'place' },
        { id: 'pl8', text: '식당', pictogram: 'restaurant', grammarType: 'place' },
        { id: 'pl9', text: '공원', pictogram: 'park', grammarType: 'place' },
        
        // 기타 장소
        { id: 'pl10', text: '밖', pictogram: 'outside', grammarType: 'place' },
        { id: 'pl11', text: '여기', pictogram: 'here', grammarType: 'place' },
        { id: 'pl12', text: '저기', pictogram: 'there-place', grammarType: 'place' },
        
        // 교통수단 (80% 응답률)
        { id: 'pl_car', text: '차', pictogram: 'car', grammarType: 'place' },
        { id: 'pl_bus', text: '버스', pictogram: 'bus', grammarType: 'place' },
        { id: 'pl_subway', text: '지하철', pictogram: 'subway', grammarType: 'place' }
    ],

    // ★ 사물 카테고리 - 옷 세분화 + 형용사 추가
    thing: [
        // 미디어/전자기기 (70%+ 응답률)
        { id: 'th_tv', text: 'TV', pictogram: 'tv', grammarType: 'object' },
        { id: 'th_phone', text: '핸드폰', pictogram: 'phone', grammarType: 'object' },
        
        // 장난감 (80%+ 응답률)
        { id: 'th_toy', text: '장난감', pictogram: 'toy', grammarType: 'object' },
        { id: 'th_book', text: '책', pictogram: 'book', grammarType: 'object' },
        { id: 'th_ball', text: '공', pictogram: 'ball', grammarType: 'object' },
        { id: 'th_doll', text: '인형', pictogram: 'doll', grammarType: 'object' },
        { id: 'th_block', text: '블록', pictogram: 'block', grammarType: 'object' },
        
        // 옷 세분화 (83% 신발, 80% 바지, 77% 양말)
        { id: 'th_shoes', text: '신발', pictogram: 'shoes', grammarType: 'object' },
        { id: 'th_pants', text: '바지', pictogram: 'pants', grammarType: 'object' },
        { id: 'th_socks', text: '양말', pictogram: 'socks', grammarType: 'object' },
        { id: 'th_clothes', text: '옷', pictogram: 'clothes', grammarType: 'object' },
        { id: 'th_hat', text: '모자', pictogram: 'hat', grammarType: 'object' },
        
        // 생활용품
        { id: 'th_med', text: '약', pictogram: 'medicine', grammarType: 'object' },
        { id: 'th_tissue', text: '휴지', pictogram: 'tissue', grammarType: 'object' },
        { id: 'th_blanket', text: '이불', pictogram: 'blanket', grammarType: 'object' },
        { id: 'th_brush', text: '칫솔', pictogram: 'toothbrush', grammarType: 'object' },
        
        // 형용사 (사물 묘사용) - 67% 응답률
        { id: 'th_big', text: '커요', pictogram: 'big', grammarType: 'adjective' },
        { id: 'th_small', text: '작아요', pictogram: 'small', grammarType: 'adjective' },
        { id: 'th_pretty', text: '예뻐요', pictogram: 'pretty', grammarType: 'adjective' },
        { id: 'th_dirty', text: '더러워요', pictogram: 'dirty', grammarType: 'adjective' },
        { id: 'th_new', text: '새거예요', pictogram: 'new', grammarType: 'adjective' },
        { id: 'water-thing', text: '물', pictogram: 'water-thing', category: 'thing', grammarType: 'noun' },
        { id: 'bag', text: '가방', pictogram: 'bag', category: 'thing', grammarType: 'noun' },
        { id: 'key', text: '열쇠', pictogram: 'key', category: 'thing', grammarType: 'noun' },
        { id: 'cup', text: '컵', pictogram: 'cup', category: 'thing', grammarType: 'noun' },
        { id: 'spoon', text: '숟가락', pictogram: 'spoon', category: 'thing', grammarType: 'noun' },
        { id: 'mirror', text: '거울', pictogram: 'mirror', category: 'thing', grammarType: 'noun' },
    ],

    // ★ 시간 카테고리
    time: [
        { id: 't1', text: '지금', pictogram: 'now', grammarType: 'time' },
        { id: 't2', text: '나중에', pictogram: 'later', grammarType: 'time' },
        { id: 't3', text: '아침', pictogram: 'morning', grammarType: 'time' },
        { id: 't4', text: '점심', pictogram: 'noon', grammarType: 'time' },
        { id: 't5', text: '저녁', pictogram: 'evening', grammarType: 'time' },
        { id: 't6', text: '밤', pictogram: 'night', grammarType: 'time' },
        { id: 't7', text: '오늘', pictogram: 'today', grammarType: 'time' },
        { id: 't8', text: '내일', pictogram: 'tomorrow', grammarType: 'time' },
        { id: 't9', text: '어제', pictogram: 'yesterday', grammarType: 'time' },
        { id: 't10', text: '잠깐만', pictogram: 'moment', grammarType: 'time' },
        { id: 't11', text: '곧', pictogram: 'soon', grammarType: 'time' }
    ],
    
    // ★ 병원 카테고리 - 이정은 & 박은혜(2000) 상황별 어휘
    hospital: [
        // 증상 표현
        { id: 'hos1', text: '아파요', pictogram: 'pain', grammarType: 'verb' },
        { id: 'hos2', text: '머리 아파요', pictogram: 'headache', grammarType: 'verb' },
        { id: 'hos3', text: '배 아파요', pictogram: 'stomachache', grammarType: 'verb' },
        { id: 'hos4', text: '열나요', pictogram: 'fever', grammarType: 'verb' },
        { id: 'hos5', text: '기침해요', pictogram: 'cough', grammarType: 'verb' },
        { id: 'hos6', text: '콧물 나요', pictogram: 'runny-nose', grammarType: 'verb' },
        { id: 'hos7', text: '토할 것 같아요', pictogram: 'nausea', grammarType: 'verb' },
        { id: 'hos8', text: '어지러워요', pictogram: 'dizzy', grammarType: 'verb' },
        
        // 신체 부위
        { id: 'hos9', text: '머리', pictogram: 'head', grammarType: 'object' },
        { id: 'hos10', text: '배', pictogram: 'stomach', grammarType: 'object' },
        { id: 'hos11', text: '목', pictogram: 'throat', grammarType: 'object' },
        { id: 'hos12', text: '귀', pictogram: 'ear', grammarType: 'object' },
        { id: 'hos13', text: '눈', pictogram: 'eye', grammarType: 'object' },
        { id: 'hos14', text: '이', pictogram: 'tooth', grammarType: 'object' },
        
        // 병원 요청
        { id: 'hos15', text: '주사 싫어요', pictogram: 'no-injection', grammarType: 'verb' },
        { id: 'hos16', text: '약 주세요', pictogram: 'medicine-please', grammarType: 'verb' },
        { id: 'hos17', text: '무서워요', pictogram: 'scared', grammarType: 'verb' },
        { id: 'hos18', text: '언제 끝나요?', pictogram: 'when-done', grammarType: 'question' }
    ],
    
    // ★ 학교 카테고리 - 김영태 외(2003) 학교 상황 어휘
    school: [
        // 수업 관련
        { id: 'sch1', text: '선생님', pictogram: 'teacher', grammarType: 'subject' },
        { id: 'sch2', text: '숙제', pictogram: 'homework', grammarType: 'object' },
        { id: 'sch3', text: '책', pictogram: 'book', grammarType: 'object' },
        { id: 'sch4', text: '공책', pictogram: 'notebook', grammarType: 'object' },
        { id: 'sch5', text: '연필', pictogram: 'pencil', grammarType: 'object' },
        { id: 'sch6', text: '지우개', pictogram: 'eraser', grammarType: 'object' },
        
        // 학교 활동
        { id: 'sch7', text: '공부해요', pictogram: 'study', grammarType: 'verb' },
        { id: 'sch8', text: '질문 있어요', pictogram: 'question-have', grammarType: 'verb' },
        { id: 'sch9', text: '모르겠어요', pictogram: 'dont-understand', grammarType: 'verb' },
        { id: 'sch10', text: '다 했어요', pictogram: 'finished', grammarType: 'verb' },
        { id: 'sch11', text: '쉬는 시간이에요?', pictogram: 'break-time', grammarType: 'question' },
        
        // 요청
        { id: 'sch12', text: '화장실 가도 돼요?', pictogram: 'toilet-permission', grammarType: 'question' },
        { id: 'sch13', text: '물 마셔도 돼요?', pictogram: 'water-permission', grammarType: 'question' },
        { id: 'sch14', text: '다시 설명해 주세요', pictogram: 'explain-again', grammarType: 'request' },
        { id: 'sch15', text: '도와주세요', pictogram: 'help-please', grammarType: 'request' }
    ]
};

// 상황별 보드 설정
// 김영태, 박현주, 민홍기 (2003). 보완·대체의사소통도구 개발을 위한 학령기 아동 및 성인의 핵심어휘 조사.
// 언어청각장애연구, 8(2), 93-110.
// - 9가지 상황(음식점, 학교, 쇼핑, 가정, 미용실, 영화관, 비디오가게, 병원, 은행) 발화 분석
// - 상황별로 47% 차이나는 부수어휘 확인
// - 병원: 아프다, 가렵다, 심하다 등 증상 관련 어휘
// - 가정: 엄마, TV, 식사 관련 어휘
// - 음식점: 주문, 수량, 맛 관련 어휘
export const SITUATION_BOARDS = {
    home: {
        name: '🏠 집에서',
        cards: ['pe2', 'pe3', 'fo1', 'fo7', 'th_tv', 'act_sleep', 'pl3', 'f10', 'c_want', 'act_wash', 'watch-tv', 'turn-on', 'turn-off']
    },
    hospital: {
        name: '🏥 병원에서',
        cards: ['em2', 'em1', 'f14', 'pe12', 'pe13', 'th_med', 'f8', 'gr_thanks', 'f6', 'hos5', 'hos1', 'hos2', 'hos3', 'hos4']
    },
    restaurant: {
        name: '🍽️ 식당에서',
        cards: ['fo1', 'fo7', 'fo_moreeat', 'fo_yummy', 'fo_full', 'c_more', 'c_want', 'gr_thanks', 'fo2', 'give-me', 'noodle', 'chicken']
    },
    school: {
        name: '🏫 학교에서',
        cards: ['pe10', 'sch1', 'sch2', 'sch3', 'sch4', 'sch5', 'sch6', 'sch7', 'sch8', 'sch9', 'sch10', 'sch11', 'sch12', 'sch13', 'sch14', 'sch15']
    },
    daycare: {
        name: '🧒 어린이집에서',
        cards: ['pe10', 'pe11', 'act_play', 'act_tidy', 'gr_hi', 'gr_bye', 'act_wait', 'em3', 'sch15', 'act_draw', 'act_sing']
    },
    car: {
        name: '🚗 차 안에서',
        cards: ['pl_car', 'gr_where', 'gr_when', 't1', 'f12', 'em3', 'c_dontknow', 'act_wait', 'f10', 't11']
    },
    park: {
        name: '🌳 공원에서',
        cards: ['pl9', 'act_run', 'act_walk', 'act_play', 'c_more', 'f1', 'fo7', 'gr_hi', 'pe11', 'together']
    },
    mart: {
        name: '🛒 마트에서',
        cards: ['pl7', 'c_want', 'c_this', 'give-me', 'like-it', 'dont-want', 'fo1', 'fo7', 'fo10', 'fo11', 'fo6']
    },
    bath: {
        name: '🛁 목욕할 때',
        cards: ['act_wash', 'act_shower', 'fo7', 'act_undress', 'act_dress', 'th_blanket', 'f4', 'finished', 'help-core']
    }
};

export default DEFAULT_CARDS;
