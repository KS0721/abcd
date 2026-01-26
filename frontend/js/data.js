// ========================================
// data.js - 카드 데이터, 아이콘, 동사 변환
// ========================================
console.log('📦 data.js 로드됨');

// 아이콘 목록
const availableIcons = [
    "heart", "star", "smile", "frown", "meh", "angry",
    "thumbs-up", "thumbs-down", "hand", "home", "car", "bus",
    "phone", "mail", "camera", "music", "book", "pen",
    "clock", "calendar", "sun", "moon", "cloud", "umbrella",
    "coffee", "pizza", "apple", "cake", "cookie", "candy",
    "shirt", "glasses", "watch", "key", "lock", "gift",
    "flag", "map", "compass", "globe", "flower",
    "dog", "cat", "bird", "fish", "paw-print",
    "baby", "user", "users", "accessibility", "eye", "ear",
    "brain", "activity", "pill", "stethoscope", "thermometer", "bandage",
    "bed", "bath", "door-open", "lamp", "tv",
    "wifi", "battery", "zap", "flame", "snowflake", "droplet",
    "wind", "volume-2", "bell", "alarm-clock", "hourglass",
    "check", "x", "plus", "minus", "help-circle", "info",
    "alert-circle", "alert-triangle", "shield", "award"
];

// 시제/존댓말 변환
const verbConjugations = {
    "가요": { past: "갔어요", future: "갈 거예요", casual: "가", formal: "갑니다" },
    "와요": { past: "왔어요", future: "올 거예요", casual: "와", formal: "옵니다" },
    "먹어요": { past: "먹었어요", future: "먹을 거예요", casual: "먹어", formal: "먹습니다" },
    "마셔요": { past: "마셨어요", future: "마실 거예요", casual: "마셔", formal: "마십니다" },
    "화장실 가요": { past: "화장실 갔어요", future: "화장실 갈 거예요", casual: "화장실 가", formal: "화장실 갑니다" },
    "자요": { past: "잤어요", future: "잘 거예요", casual: "자", formal: "잡니다" },
    "멈춰요": { past: "멈췄어요", future: "멈출 거예요", casual: "멈춰", formal: "멈춥니다" },
    "기다려요": { past: "기다렸어요", future: "기다릴 거예요", casual: "기다려", formal: "기다립니다" },
    "봐요": { past: "봤어요", future: "볼 거예요", casual: "봐", formal: "봅니다" },
    "들어요": { past: "들었어요", future: "들을 거예요", casual: "들어", formal: "듣습니다" },
    "써요": { past: "썼어요", future: "쓸 거예요", casual: "써", formal: "씁니다" },
    "전화해요": { past: "전화했어요", future: "전화할 거예요", casual: "전화해", formal: "전화합니다" },
    "좋아요": { past: "좋았어요", future: "좋을 거예요", casual: "좋아", formal: "좋습니다" },
    "슬퍼요": { past: "슬펐어요", future: "슬플 거예요", casual: "슬퍼", formal: "슬픕니다" },
    "화나요": { past: "화났어요", future: "화날 거예요", casual: "화나", formal: "화납니다" },
    "무서워요": { past: "무서웠어요", future: "무서울 거예요", casual: "무서워", formal: "무섭습니다" },
    "피곤해요": { past: "피곤했어요", future: "피곤할 거예요", casual: "피곤해", formal: "피곤합니다" },
    "행복해요": { past: "행복했어요", future: "행복할 거예요", casual: "행복해", formal: "행복합니다" },
    "도와주세요": { past: "도와줬어요", future: "도와줄 거예요", casual: "도와줘", formal: "도와주십시오" },
    "머리 아파요": { past: "머리 아팠어요", future: "머리 아플 거예요", casual: "머리 아파", formal: "머리 아픕니다" },
    "배 아파요": { past: "배 아팠어요", future: "배 아플 거예요", casual: "배 아파", formal: "배 아픕니다" },
    "어지러워요": { past: "어지러웠어요", future: "어지러울 거예요", casual: "어지러워", formal: "어지럽습니다" },
    "추워요": { past: "추웠어요", future: "추울 거예요", casual: "추워", formal: "춥습니다" }
};

// 기본 카드 데이터
const defaultCardData = {
    action: [
        { icon: "footprints", text: "가요" },
        { icon: "home", text: "와요" },
        { icon: "utensils", text: "먹어요" },
        { icon: "cup-soda", text: "마셔요" },
        { icon: "door-open", text: "화장실 가요" },
        { icon: "moon", text: "자요" },
        { icon: "square", text: "멈춰요" },
        { icon: "clock", text: "기다려요" },
        { icon: "eye", text: "봐요" },
        { icon: "ear", text: "들어요" },
        { icon: "pencil", text: "써요" },
        { icon: "phone", text: "전화해요" }
    ],
    feeling: [
        { icon: "smile", text: "좋아요" },
        { icon: "frown", text: "슬퍼요" },
        { icon: "angry", text: "화나요" },
        { icon: "alert-circle", text: "무서워요" },
        { icon: "battery-low", text: "피곤해요" },
        { icon: "cloud", text: "답답해요" },
        { icon: "heart", text: "행복해요" },
        { icon: "cloud-rain", text: "우울해요" },
        { icon: "zap", text: "놀랐어요" },
        { icon: "meh", text: "그냥 그래요" },
        { icon: "thumbs-up", text: "기분 좋아요" },
        { icon: "thumbs-down", text: "기분 나빠요" }
    ],
    need: [
        { icon: "help-circle", text: "도와주세요" },
        { icon: "pill", text: "약 주세요" },
        { icon: "droplet", text: "물 주세요" },
        { icon: "utensils", text: "밥 주세요" },
        { icon: "phone", text: "전화해주세요" },
        { icon: "stethoscope", text: "의사 불러주세요" },
        { icon: "volume-x", text: "조용히 해주세요" },
        { icon: "repeat", text: "다시 말해주세요" },
        { icon: "shirt", text: "옷 갈아입을래요" },
        { icon: "wind", text: "환기해주세요" },
        { icon: "sun", text: "불 켜주세요" },
        { icon: "moon", text: "불 꺼주세요" }
    ],
    pain: [
        { icon: "brain", text: "머리" },
        { icon: "heart", text: "가슴" },
        { icon: "circle", text: "배" },
        { icon: "arrow-down", text: "다리" },
        { icon: "hand", text: "팔" },
        { icon: "rotate-ccw", text: "어지러움" },
        { icon: "frown", text: "토할 것 같음" },
        { icon: "snowflake", text: "추움" },
        { icon: "flame", text: "열남" },
        { icon: "eye", text: "눈" },
        { icon: "ear", text: "귀" },
        { icon: "smile", text: "이/잇몸" }
    ],
    place: [
        { icon: "home", text: "집" },
        { icon: "building", text: "병원" },
        { icon: "graduation-cap", text: "학교" },
        { icon: "door-open", text: "화장실" },
        { icon: "bed", text: "침실" },
        { icon: "sofa", text: "거실" },
        { icon: "utensils", text: "식당" },
        { icon: "shopping-cart", text: "마트" },
        { icon: "briefcase", text: "회사" },
        { icon: "church", text: "종교시설" },
        { icon: "car", text: "차 안" }
    ],
    person: [
        { icon: "user", text: "나" },
        { icon: "heart", text: "엄마" },
        { icon: "shield", text: "아빠" },
        { icon: "users", text: "가족" },
        { icon: "graduation-cap", text: "선생님" },
        { icon: "stethoscope", text: "의사" },
        { icon: "plus-circle", text: "간호사" },
        { icon: "smile", text: "친구" },
        { icon: "baby", text: "아이" },
        { icon: "glasses", text: "할머니" },
        { icon: "glasses", text: "할아버지" },
        { icon: "briefcase", text: "직장동료" }
    ],
    food: [
        { icon: "beef", text: "고기", type: "solid" },
        { icon: "salad", text: "야채", type: "solid" },
        { icon: "apple", text: "과일", type: "solid" },
        { icon: "sandwich", text: "빵", type: "solid" },
        { icon: "soup", text: "국/찌개", type: "solid" },
        { icon: "wheat", text: "밥", type: "solid" },
        { icon: "egg", text: "계란", type: "solid" },
        { icon: "fish", text: "생선", type: "solid" },
        { icon: "milk", text: "우유", type: "drink" },
        { icon: "coffee", text: "커피", type: "drink" },
        { icon: "cup-soda", text: "음료수", type: "drink" },
        { icon: "cookie", text: "과자", type: "solid" }
    ],
    time: [
        { icon: "sunrise", text: "아침" },
        { icon: "sun", text: "점심" },
        { icon: "sunset", text: "저녁" },
        { icon: "moon", text: "밤" },
        { icon: "clock", text: "지금" },
        { icon: "clock", text: "나중에" },
        { icon: "calendar", text: "오늘" },
        { icon: "calendar-plus", text: "내일" },
        { icon: "calendar-minus", text: "어제" },
        { icon: "hourglass", text: "잠깐만" },
        { icon: "hourglass", text: "곧" },
        { icon: "infinity", text: "항상" }
    ]
};