import { describe, it, expect } from 'vitest';
import {
  sanitizeKeyword,
  isValidArasaacId,
  isValidArasaacUrl,
  sanitizeText,
  isValidCardText,
} from '../sanitize.ts';

describe('sanitizeKeyword', () => {
  it('한글/영문/숫자/공백 유지', () => {
    expect(sanitizeKeyword('물 water 123')).toBe('물 water 123');
  });

  it('특수문자 제거', () => {
    expect(sanitizeKeyword('물<script>')).toBe('물script');
  });

  it('50자 초과 시 잘림', () => {
    const long = '가'.repeat(60);
    expect(sanitizeKeyword(long)).toHaveLength(50);
  });

  it('string이 아니면 빈 문자열', () => {
    expect(sanitizeKeyword(123 as unknown as string)).toBe('');
  });
});

describe('isValidArasaacId', () => {
  it('양의 정수 → true', () => {
    expect(isValidArasaacId(12345)).toBe(true);
  });

  it('0 이하 → false', () => {
    expect(isValidArasaacId(0)).toBe(false);
    expect(isValidArasaacId(-1)).toBe(false);
  });

  it('100000 이상 → false', () => {
    expect(isValidArasaacId(100000)).toBe(false);
  });

  it('소수점 → false', () => {
    expect(isValidArasaacId(1.5)).toBe(false);
  });
});

describe('isValidArasaacUrl', () => {
  it('ARASAAC 도메인 → true', () => {
    expect(isValidArasaacUrl('https://static.arasaac.org/pictograms/1/1_500.png')).toBe(true);
  });

  it('다른 도메인 → false', () => {
    expect(isValidArasaacUrl('https://evil.com/image.png')).toBe(false);
  });

  it('잘못된 URL → false', () => {
    expect(isValidArasaacUrl('not-a-url')).toBe(false);
  });
});

describe('sanitizeText', () => {
  it('HTML 특수문자 제거', () => {
    expect(sanitizeText('<b>bold</b>')).toBe('bbold/b');
  });

  it('100자 초과 시 잘림', () => {
    const long = 'a'.repeat(150);
    expect(sanitizeText(long)).toHaveLength(100);
  });
});

describe('isValidCardText', () => {
  it('정상 텍스트 → true', () => {
    expect(isValidCardText('물')).toBe(true);
  });

  it('빈 문자열 → false', () => {
    expect(isValidCardText('')).toBe(false);
  });

  it('HTML 태그만 있으면 → false', () => {
    expect(isValidCardText('<>')).toBe(false);
  });
});
