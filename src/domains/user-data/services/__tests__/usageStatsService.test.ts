import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  recordCardUsage,
  recordPhraseUsage,
  getFrequentCardsForNow,
  getCardsAfter,
  getCardFrequencyMap,
  getFrequentPhrases,
  getUsageSummary,
  getCurrentTimeSlot,
} from '../usageStatsService.ts';

beforeEach(() => {
  localStorage.clear();
  // 모듈 내부 cachedData를 리셋하기 위해 — 직접 접근 불가하므로 localStorage 초기화 후
  // 새 데이터로 시작 (cachedData는 loadData()에서 갱신됨)
  vi.restoreAllMocks();
});

describe('getCurrentTimeSlot', () => {
  it('시간대 반환', () => {
    const slot = getCurrentTimeSlot();
    expect(['morning', 'afternoon', 'evening', 'night']).toContain(slot);
  });
});

describe('recordCardUsage', () => {
  it('카드 사용 기록 후 빈도맵 업데이트', () => {
    recordCardUsage('card1');
    recordCardUsage('card1');
    recordCardUsage('card2');
    const map = getCardFrequencyMap();
    expect(map['card1']).toBe(2);
    expect(map['card2']).toBe(1);
  });

  it('연속 패턴 기록 (previousCardId)', () => {
    recordCardUsage('card1');
    recordCardUsage('card2', 'card1');
    const after = getCardsAfter('card1');
    expect(after).toContain('card2');
  });
});

describe('recordPhraseUsage', () => {
  it('문장 사용 빈도 기록', () => {
    recordPhraseUsage('안녕하세요');
    recordPhraseUsage('안녕하세요');
    recordPhraseUsage('감사합니다');
    const phrases = getFrequentPhrases(5);
    expect(phrases[0].text).toBe('안녕하세요');
    expect(phrases[0].count).toBe(2);
  });
});

describe('getFrequentCardsForNow', () => {
  it('빈도 높은 카드가 먼저 반환', () => {
    // 고유한 카드 ID 사용 (다른 테스트 오염 방지)
    const id = `freq_test_${Date.now()}`;
    recordCardUsage(id);
    recordCardUsage(id);
    recordCardUsage(id);
    const result = getFrequentCardsForNow(20);
    expect(result).toContain(id);
  });
});

describe('getCardsAfter', () => {
  it('존재하지 않는 카드 ID면 빈 배열', () => {
    expect(getCardsAfter('nonexistent')).toEqual([]);
  });
});

describe('getUsageSummary', () => {
  it('전체 통계 요약 반환', () => {
    recordCardUsage('c1');
    recordPhraseUsage('문장1');
    const summary = getUsageSummary();
    expect(summary.totalCards).toBeGreaterThanOrEqual(1);
    expect(summary.totalPhrases).toBeGreaterThanOrEqual(1);
    expect(summary.topCards.length).toBeGreaterThanOrEqual(1);
    expect(summary.topPhrases.length).toBeGreaterThanOrEqual(1);
  });
});
