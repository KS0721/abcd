import { describe, it, expect, beforeEach } from 'vitest';
import { getImageUrl, getImageById, getFallbackSvg, clearCache } from '../arasaac.ts';

beforeEach(() => {
  localStorage.clear();
  clearCache();
});

describe('getImageUrl', () => {
  it('유효한 ID → ARASAAC URL 반환', () => {
    const url = getImageUrl(12345);
    expect(url).toContain('static.arasaac.org');
    expect(url).toContain('12345');
    expect(url).toContain('_500.png');
  });

  it('다른 사이즈 지정', () => {
    const url = getImageUrl(100, 300);
    expect(url).toContain('_300.png');
  });

  it('유효하지 않은 ID → null', () => {
    expect(getImageUrl(0)).toBeNull();
    expect(getImageUrl(-1)).toBeNull();
    expect(getImageUrl(100000)).toBeNull();
  });
});

describe('getImageById', () => {
  it('유효한 ID → URL 반환', () => {
    const url = getImageById(5000);
    expect(url).toContain('5000');
    expect(url).toContain('_500.png');
  });

  it('유효하지 않은 ID → null', () => {
    expect(getImageById(0)).toBeNull();
  });
});

describe('getFallbackSvg', () => {
  it('data:image/svg+xml 형식 반환', () => {
    const svg = getFallbackSvg('물', 'food');
    expect(svg).toMatch(/^data:image\/svg\+xml,/);
  });

  it('카테고리별 다른 색상', () => {
    const food = getFallbackSvg('밥', 'food');
    const action = getFallbackSvg('가다', 'action');
    expect(food).not.toBe(action);
  });

  it('빈 텍스트 시 ? 표시', () => {
    const svg = getFallbackSvg('', 'thing');
    expect(svg).toContain('%3F'); // ? encoded
  });

  it('알 수 없는 카테고리는 기본 색상 사용', () => {
    const svg = getFallbackSvg('테스트', 'unknown_cat');
    expect(svg).toMatch(/^data:image\/svg\+xml,/);
  });
});
