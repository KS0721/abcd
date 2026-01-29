// ========================================
// config.js - 규칙, 설정
// ========================================
console.log('⚙️ config.js 로드됨');

// ========================================
// 동사별 추천 설정
// ========================================
const VERB_SUGGESTIONS = {
    '가요': {
        show: true,
        categories: ['place', 'person', 'time']
    },
    '와요': {
        show: true,
        categories: ['place', 'person', 'time']
    },
    '먹어요': {
        show: true,
        categories: ['food', 'place', 'time']
    },
    '마셔요': {
        show: true,
        categories: ['food', 'place', 'time']
    },
    '봐요': {
        show: true,
        categories: ['person', 'place', 'time']
    },
    '만나요': {
        show: true,
        categories: ['person', 'place', 'time']
    },
    '기다려요': {
        show: true,
        categories: ['person', 'place', 'time']
    },
    '전화해요': {
        show: true,
        categories: ['person', 'time']
    },
    '좋아요': {
        show: true,
        categories: ['food', 'person']
    },
    // 추천 없는 동사들 (완성형)
    '화장실 가요': { show: false },
    '자요': { show: false },
    '멈춰요': { show: false },
    '들어요': { show: false },
    '써요': { show: false },
    '슬퍼요': { show: false },
    '화나요': { show: false },
    '무서워요': { show: false },
    '피곤해요': { show: false },
    '답답해요': { show: false },
    '행복해요': { show: false },
    '우울해요': { show: false },
    '놀랐어요': { show: false },
    '그냥 그래요': { show: false },
    '기분 좋아요': { show: false },
    '기분 나빠요': { show: false },
    '도와주세요': { show: false },
    '약 주세요': { show: false },
    '물 주세요': { show: false },
    '밥 주세요': { show: false },
    '전화해주세요': { show: false },
    '의사 불러주세요': { show: false },
    '조용히 해주세요': { show: false },
    '다시 말해주세요': { show: false },
    '옷 갈아입을래요': { show: false },
    '환기해주세요': { show: false },
    '불 켜주세요': { show: false },
    '불 꺼주세요': { show: false }
};

// ========================================
// 카테고리 규칙
// ========================================
const CATEGORY_RULES = {
    single: ['action', 'feeling', 'pain', 'time'],
    multiple: ['food', 'place', 'person', 'need']
};

const PREDICATE_CATEGORIES = ['action', 'feeling', 'need', 'pain'];

// ========================================
// 문장 생성 (단순 연결)
// ========================================
function buildSentence() {
    const parts = [];
    
    // need 카테고리 처리
    if (Selection.need.length > 0) {
        return buildNeedSentence();
    }
    
    // 시간
    if (Selection.time) {
        parts.push(Selection.time.text);
    }
    
    // 장소들
    Selection.place.forEach(item => {
        parts.push(item.text);
    });
    
    // 사람들
    Selection.person.forEach(item => {
        parts.push(item.text);
    });
    
    // 음식들
    Selection.food.forEach(item => {
        parts.push(item.text);
    });
    
    // 서술어
    if (Selection.predicate) {
        parts.push(Selection.predicate.text);
    }
    
    return parts.join(' ');
}

function buildNeedSentence() {
    if (Selection.need.length === 0) return '';
    
    // 단일 요청
    if (Selection.need.length === 1) {
        return Selection.need[0].text;
    }
    
    // 복수 요청 - 단어만 추출해서 연결
    const items = Selection.need.map(n => {
        let item = n.text;
        // "주세요", "불러주세요", "해주세요" 등 제거
        item = item.replace(' 주세요', '')
                   .replace(' 불러주세요', '')
                   .replace(' 해주세요', '')
                   .replace('해주세요', '');
        return item;
    });
    
    return items.join(' ') + ' 주세요';
}