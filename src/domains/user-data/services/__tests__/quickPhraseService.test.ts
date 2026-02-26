import { describe, it, expect, beforeEach, vi } from 'vitest';

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

import { loadQuickPhrases, addPhrase, removePhrase, updatePhrase } from '../quickPhraseService.ts';
import { safeStorage } from '../../../../infrastructure/storage/safeStorage.ts';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('loadQuickPhrases', () => {
  it('저장된 값 없으면 기본값 반환', () => {
    vi.mocked(safeStorage.get).mockReturnValueOnce(null);
    const defaults = ['안녕하세요', '감사합니다'];
    expect(loadQuickPhrases(defaults)).toEqual(defaults);
  });

  it('저장된 값 있으면 저장값 반환', () => {
    vi.mocked(safeStorage.get).mockReturnValueOnce(['저장된 문장']);
    expect(loadQuickPhrases(['기본값'])).toEqual(['저장된 문장']);
  });
});

describe('addPhrase', () => {
  it('새 문장 추가', () => {
    const result = addPhrase(['기존 문장'], '새 문장');
    expect(result).toEqual(['기존 문장', '새 문장']);
    expect(safeStorage.set).toHaveBeenCalled();
  });

  it('중복 문장 추가 시 변화 없음', () => {
    const phrases = ['안녕하세요', '감사합니다'];
    const result = addPhrase(phrases, '안녕하세요');
    expect(result).toBe(phrases);
    expect(safeStorage.set).not.toHaveBeenCalled();
  });
});

describe('removePhrase', () => {
  it('인덱스로 문장 삭제', () => {
    const result = removePhrase(['가', '나', '다'], 1);
    expect(result).toEqual(['가', '다']);
  });
});

describe('updatePhrase', () => {
  it('인덱스의 문장 교체', () => {
    const result = updatePhrase(['가', '나', '다'], 1, '바');
    expect(result).toEqual(['가', '바', '다']);
  });

  it('다른 인덱스는 변경 없음', () => {
    const result = updatePhrase(['가', '나', '다'], 0, '마');
    expect(result[1]).toBe('나');
    expect(result[2]).toBe('다');
  });
});
