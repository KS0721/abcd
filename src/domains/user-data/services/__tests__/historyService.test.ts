import { describe, it, expect, beforeEach, vi } from 'vitest';

// safeStorage와 usageStats를 mock
vi.mock('../../../../infrastructure/storage/safeStorage.ts', () => {
  const store: Record<string, unknown> = {};
  return {
    safeStorage: {
      get: vi.fn((key: string) => store[key] ?? null),
      set: vi.fn((key: string, value: unknown) => { store[key] = value; }),
      remove: vi.fn((key: string) => { delete store[key]; }),
      _store: store,
    },
  };
});

vi.mock('../usageStatsService.ts', () => ({
  recordPhraseUsage: vi.fn(),
}));

import { loadHistory, addToHistoryList, clearHistoryStorage } from '../historyService.ts';
import { safeStorage } from '../../../../infrastructure/storage/safeStorage.ts';

beforeEach(() => {
  vi.clearAllMocks();
  const store = (safeStorage as unknown as { _store: Record<string, unknown> })._store;
  Object.keys(store).forEach((k) => delete store[k]);
});

describe('loadHistory', () => {
  it('저장된 히스토리 없으면 빈 배열', () => {
    expect(loadHistory()).toEqual([]);
  });

  it('저장된 히스토리 반환', () => {
    vi.mocked(safeStorage.get).mockReturnValueOnce(['안녕하세요', '물 주세요']);
    expect(loadHistory()).toEqual(['안녕하세요', '물 주세요']);
  });
});

describe('addToHistoryList', () => {
  it('새 메시지를 앞에 추가', () => {
    const result = addToHistoryList(['기존 문장'], '새 문장');
    expect(result[0]).toBe('새 문장');
    expect(result[1]).toBe('기존 문장');
  });

  it('같은 메시지 연속 추가 시 무시', () => {
    const result = addToHistoryList(['같은 문장', '다른 문장'], '같은 문장');
    expect(result).toEqual(['같은 문장', '다른 문장']);
  });

  it('최대 100개 제한', () => {
    const history = Array.from({ length: 100 }, (_, i) => `문장${i}`);
    const result = addToHistoryList(history, '새 문장');
    expect(result).toHaveLength(100);
    expect(result[0]).toBe('새 문장');
  });
});

describe('clearHistoryStorage', () => {
  it('safeStorage.remove 호출', () => {
    clearHistoryStorage();
    expect(safeStorage.remove).toHaveBeenCalledWith('aac_history');
  });
});
