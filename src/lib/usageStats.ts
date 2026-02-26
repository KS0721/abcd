// ========================================
// usageStats.ts - 카드 사용 빈도 추적 (로컬)
//
// 나의AAC(NC문화재단) 대응 기능: "사용 통계"
// 사용자에게 보이지 않는 백그라운드 추적으로 추천 품질 향상
//
// 논문 근거:
//   - Higginbotham & Wilkins (1999): 의사소통 이력 → 반복 발화 속도 50% 향상
//   - Light & McNaughton (2014): AAC 사용자 발화의 70%가 반복적
//   - Trnka et al. (2009): 사용 빈도 기반 예측 → 입력 40% 감소
// ========================================

const STORAGE_KEY = 'aac_usage_stats';

// 시간대 구분
type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night';

function getTimeSlot(): TimeSlot {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

// 카드별 사용 통계
interface CardUsage {
  total: number;                          // 전체 사용 횟수
  byTime: Record<TimeSlot, number>;       // 시간대별 횟수
  lastUsed: number;                       // 마지막 사용 timestamp
  afterCards: Record<string, number>;     // "이 카드 후에 어떤 카드?" 패턴
}

interface UsageData {
  cards: Record<string, CardUsage>;
  phrases: Record<string, number>;        // 완성 문장 빈도
  updatedAt: number;
}

// === 데이터 로드/저장 ===

function loadData(): UsageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* 무시 */ }
  return { cards: {}, phrases: {}, updatedAt: Date.now() };
}

function saveData(data: UsageData): void {
  try {
    data.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* 저장 실패 무시 */ }
}

// === 기록 함수 ===

/** 카드 선택 기록 (selectCard 호출 시) */
export function recordCardUsage(cardId: string, previousCardId?: string): void {
  const data = loadData();
  const time = getTimeSlot();

  if (!data.cards[cardId]) {
    data.cards[cardId] = {
      total: 0,
      byTime: { morning: 0, afternoon: 0, evening: 0, night: 0 },
      lastUsed: 0,
      afterCards: {},
    };
  }

  const card = data.cards[cardId];
  card.total++;
  card.byTime[time]++;
  card.lastUsed = Date.now();

  // 연속 패턴 기록: 직전 카드 → 현재 카드
  if (previousCardId) {
    if (!data.cards[previousCardId]) {
      data.cards[previousCardId] = {
        total: 0,
        byTime: { morning: 0, afternoon: 0, evening: 0, night: 0 },
        lastUsed: 0,
        afterCards: {},
      };
    }
    data.cards[previousCardId].afterCards[cardId] =
      (data.cards[previousCardId].afterCards[cardId] || 0) + 1;
  }

  saveData(data);
}

/** 완성 문장 발화 기록 (addToHistory 호출 시) */
export function recordPhraseUsage(phrase: string): void {
  const data = loadData();
  data.phrases[phrase] = (data.phrases[phrase] || 0) + 1;
  saveData(data);
}

// === 조회 함수 ===

/** 현재 시간대에 자주 쓰는 카드 ID 목록 (상위 N개) */
export function getFrequentCardsForNow(limit = 8): string[] {
  const data = loadData();
  const time = getTimeSlot();

  return Object.entries(data.cards)
    .filter(([, u]) => u.byTime[time] > 0)
    .sort((a, b) => b[1].byTime[time] - a[1].byTime[time])
    .slice(0, limit)
    .map(([id]) => id);
}

/** 특정 카드 이후에 자주 선택되는 카드 ID 목록 */
export function getCardsAfter(cardId: string, limit = 8): string[] {
  const data = loadData();
  const card = data.cards[cardId];
  if (!card) return [];

  return Object.entries(card.afterCards)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
}

/** 전체 카드 사용 빈도 맵 (카드 정렬용) */
export function getCardFrequencyMap(): Record<string, number> {
  const data = loadData();
  const result: Record<string, number> = {};
  for (const [id, usage] of Object.entries(data.cards)) {
    result[id] = usage.total;
  }
  return result;
}

/** 자주 쓰는 완성 문장 TOP N */
export function getFrequentPhrases(limit = 5): Array<{ text: string; count: number }> {
  const data = loadData();
  return Object.entries(data.phrases)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([text, count]) => ({ text, count }));
}

/** 전체 통계 요약 (기록 화면용) */
export function getUsageSummary(): {
  totalCards: number;
  totalPhrases: number;
  topCards: Array<{ id: string; count: number }>;
  topPhrases: Array<{ text: string; count: number }>;
} {
  const data = loadData();
  const topCards = Object.entries(data.cards)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10)
    .map(([id, u]) => ({ id, count: u.total }));

  const totalCards = Object.values(data.cards).reduce((sum, u) => sum + u.total, 0);
  const totalPhrases = Object.values(data.phrases).reduce((sum, c) => sum + c, 0);

  return {
    totalCards,
    totalPhrases,
    topCards,
    topPhrases: getFrequentPhrases(5),
  };
}

/** 현재 시간대 가져오기 (외부 사용) */
export function getCurrentTimeSlot(): TimeSlot {
  return getTimeSlot();
}
