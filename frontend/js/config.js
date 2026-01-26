// ========================================
// config.js - 규칙, 설정, 조사 처리
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
        categories: ['food'],
        foodFilter: 'solid'
    },
    '마셔요': {
        show: true,
        categories: ['food'],
        foodFilter: 'drink'
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
// 조사 규칙
// ========================================
const PLACE_POSTPOSITION = {
    '가요': '에',
    '와요': '에',
    '있어요': '에',
    '없어요': '에',
    '만나요': '에서',
    '먹어요': '에서',
    '마셔요': '에서',
    '봐요': '에서',
    '기다려요': '에서',
    'default': '에서'
};

const PERSON_POSTPOSITION = {
    '가요': 'destination',
    '와요': 'destination',
    '만나요': 'object',
    '봐요': 'object',
    '기다려요': 'object',
    '전화해요': 'destination',
    '좋아요': 'subject',
    'default': 'object'
};

const OBJECT_POSTPOSITION = {
    '좋아요': 'subject',
    '싫어요': 'subject',
    '필요해요': 'subject',
    '있어요': 'subject',
    '없어요': 'subject',
    '맛있어요': 'subject',
    '맛없어요': 'subject',
    '기분 좋아요': 'subject',
    '기분 나빠요': 'subject',
    'default': 'object'
};

const PREDICATE_COMPATIBILITY = {
    '가요': { time: true, place: true, person: true, food: false },
    '와요': { time: true, place: true, person: true, food: false },
    '먹어요': { time: true, place: true, person: false, food: true },
    '마셔요': { time: true, place: true, person: false, food: true },
    '봐요': { time: true, place: true, person: true, food: false },
    '만나요': { time: true, place: true, person: true, food: false },
    '기다려요': { time: true, place: true, person: true, food: false },
    '전화해요': { time: true, place: false, person: true, food: false },
    '좋아요': { time: false, place: false, person: true, food: true },
    '슬퍼요': { time: false, place: false, person: false, food: false },
    '화나요': { time: false, place: false, person: false, food: false },
    '무서워요': { time: false, place: false, person: false, food: false },
    '피곤해요': { time: false, place: false, person: false, food: false },
    '행복해요': { time: false, place: false, person: false, food: false },
    '화장실 가요': { time: true, place: false, person: false, food: false },
    '자요': { time: true, place: false, person: false, food: false },
    'default': { time: true, place: true, person: true, food: true }
};

// ========================================
// 조사 처리 함수
// ========================================

function hasFinalConsonant(text) {
    if (!text || text.length === 0) return false;
    const lastChar = text[text.length - 1];
    const code = lastChar.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return false;
    return (code - 0xAC00) % 28 !== 0;
}

function addPostposition(word, type, predicate = '') {
    if (!word) return '';
    
    const hasBatchim = hasFinalConsonant(word);
    
    switch (type) {
        case 'time':
            // 조사가 필요 없는 시간 부사들
            const noPostpositionTime = ['지금', '나중에', '오늘', '내일', '어제', '잠깐만', '곧', '항상'];
            if (noPostpositionTime.includes(word)) {
                return word;
            }
            return word + '에';
        
        case 'place':
            const placePost = PLACE_POSTPOSITION[predicate] || PLACE_POSTPOSITION['default'];
            return word + placePost;
        
        case 'person':
            const personType = PERSON_POSTPOSITION[predicate] || PERSON_POSTPOSITION['default'];
            if (personType === 'destination') {
                return word + '한테';
            } else if (personType === 'subject') {
                return word + (hasBatchim ? '이' : '가');
            } else {
                return word + (hasBatchim ? '을' : '를');
            }
        
        case 'food':
            const foodType = OBJECT_POSTPOSITION[predicate] || OBJECT_POSTPOSITION['default'];
            if (foodType === 'subject') {
                return word + (hasBatchim ? '이' : '가');
            } else {
                return word + (hasBatchim ? '을' : '를');
            }
        
        case 'connector':
            return word + (hasBatchim ? '과' : '와');
        
        default:
            return word;
    }
}

// ========================================
// 문장 생성
// ========================================

function buildSentence() {
    const parts = [];
    const predicateText = Selection.predicate?.text || '';
    const hasPredicate = !!Selection.predicate;
    
    // need 카테고리 처리
    if (Selection.need.length > 0) {
        parts.push(buildNeedSentence());
        return parts.join(' ');
    }
    
    const compat = PREDICATE_COMPATIBILITY[predicateText] || PREDICATE_COMPATIBILITY['default'];
    
    // 시간
    if (Selection.time && compat.time) {
        if (hasPredicate) {
            parts.push(addPostposition(Selection.time.text, 'time'));
        } else {
            parts.push(Selection.time.text);
        }
    }
    
    // 장소들
    if (compat.place && Selection.place.length > 0) {
        Selection.place.forEach((item, index) => {
            if (index < Selection.place.length - 1) {
                parts.push(addPostposition(item.text, 'connector'));
            } else {
                if (hasPredicate) {
                    parts.push(addPostposition(item.text, 'place', predicateText));
                } else {
                    parts.push(item.text);
                }
            }
        });
    }
    
    // 사람들
    if (compat.person && Selection.person.length > 0) {
        Selection.person.forEach((item, index) => {
            if (index < Selection.person.length - 1) {
                parts.push(addPostposition(item.text, 'connector'));
            } else {
                if (hasPredicate) {
                    parts.push(addPostposition(item.text, 'person', predicateText));
                } else {
                    parts.push(item.text);
                }
            }
        });
    }
    
    // 음식들
    if (compat.food && Selection.food.length > 0) {
        Selection.food.forEach((item, index) => {
            if (index < Selection.food.length - 1) {
                parts.push(addPostposition(item.text, 'connector'));
            } else {
                if (hasPredicate) {
                    parts.push(addPostposition(item.text, 'food', predicateText));
                } else {
                    parts.push(item.text);
                }
            }
        });
    }
    
    // 서술어
    if (Selection.predicate) {
        parts.push(predicateText);
    }
    
    return parts.join(' ');
}

function buildNeedSentence() {
    if (Selection.need.length === 0) return '';
    
    if (Selection.need.length === 1) {
        return Selection.need[0].text;
    }
    
    const items = Selection.need.map(n => {
        let item = n.text;
        item = item.replace(' 주세요', '').replace(' 불러주세요', '').replace(' 해주세요', '').replace('해주세요', '');
        return item;
    });
    
    if (items.length === 2) {
        const first = addPostposition(items[0], 'connector');
        return `${first} ${items[1]} 주세요`;
    }
    
    const lastItem = items.pop();
    const secondLast = items.pop();
    
    const frontParts = items.map(item => addPostposition(item, 'connector')).join(' ');
    const secondLastWithConnector = addPostposition(secondLast, 'connector');
    
    if (frontParts) {
        return `${frontParts} ${secondLastWithConnector} 그리고 ${lastItem} 주세요`;
    } else {
        return `${secondLastWithConnector} 그리고 ${lastItem} 주세요`;
    }
}