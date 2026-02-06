// ========================================
// config.js - 규칙, 설정
//
// [설계 원칙: "과하면 독" — 인지적 부담 최소화]
// Light, Wilkinson et al. (2019). Designing Effective AAC Displays.
// AAC, 35(1), 42-55. PMID: 30663899
// → "인지적 부담을 최소화하는 디스플레이 설계가 핵심"
// → "시각장면디스플레이(VSD)는 작업기억/정신적 유연성 부담 감소"
//
// Thistle & Wilkinson (2017). AAC, 33(3), 160-169. PMID: 28617614
// → "24개 미만 소규모 그리드에서 배경색이 오히려 탐색을 방해"
// → "심볼 수를 적절히 제한하고, 불필요한 시각적 복잡성 배제"
//
// [핵심어휘 이중 접근법]
// Beukelman & Light (2020). AAC (5th ed.). Brookes.
// → 핵심어휘(core) + 개인 부수어휘(fringe) 병행
//
// [한국어 특수성]
// 신상은 (2017). 한국어 핵심어휘 분석.
// → 용언 활용(시제/존댓말)으로 영어보다 핵심어휘 수 多
// ========================================
console.log('⚙️ config.js 로드됨');

// ========================================
// 카테고리 규칙
// ========================================
const CATEGORY_RULES = {
    single: ['core', 'action', 'feeling', 'pain', 'time', 'need'],
    multiple: ['person']
};

// 서술어 카테고리 (단일 선택, 상호 배타적)
const PREDICATE_CATEGORIES = ['core', 'action', 'feeling', 'pain'];

// ========================================
// 문장 생성 (단순 연결)
// ========================================
function buildSentence() {
    const parts = [];
    
    if (Selection.time) parts.push(Selection.time.text);
    Selection.person.forEach(item => parts.push(item.text));
    if (Selection.predicate) parts.push(Selection.predicate.text);
    if (Selection.need) parts.push(Selection.need.text);
    
    return parts.join(' ');
}