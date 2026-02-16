// ========================================
// arasaac.ts - ARASAAC 이미지 로더
// 출처: legacy/js/data/pictograms.js
// ========================================

import { sanitizeKeyword, isValidArasaacId, isValidArasaacUrl } from './sanitize';

const ARASAAC_API = 'https://api.arasaac.org/v1/pictograms/ko/search';
const ARASAAC_IMG = 'https://static.arasaac.org/pictograms';
const CACHE_KEY = 'aac_arasaac_cache';
const CACHE_VERSION = 1;

// 메모리 캐시
let memoryCache: Record<string, number | null> = loadCache();

// 캐시 로드
function loadCache(): Record<string, number | null> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed?.version === CACHE_VERSION && typeof parsed.data === 'object') {
      return parsed.data;
    }
    localStorage.removeItem(CACHE_KEY);
    return {};
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return {};
  }
}

// 캐시 저장
function saveCache(cache: Record<string, number | null>): void {
  try {
    const data = JSON.stringify({ version: CACHE_VERSION, data: cache });
    if (data.length > 1024 * 1024) {
      localStorage.removeItem(CACHE_KEY);
      return;
    }
    localStorage.setItem(CACHE_KEY, data);
  } catch {
    // 저장 실패 무시
  }
}

// API에서 픽토그램 ID 검색
async function searchPictogramId(keyword: string): Promise<number | null> {
  const safe = sanitizeKeyword(keyword);
  if (!safe) return null;

  if (memoryCache[safe] !== undefined) {
    return memoryCache[safe];
  }

  try {
    const encoded = encodeURIComponent(safe);
    const response = await fetch(`${ARASAAC_API}/${encoded}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      memoryCache[safe] = null;
      return null;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      memoryCache[safe] = null;
      return null;
    }

    const id = data[0]._id;
    if (!isValidArasaacId(id)) {
      memoryCache[safe] = null;
      return null;
    }

    memoryCache[safe] = id;
    return id;
  } catch {
    return null;
  }
}

/** ARASAAC 픽토그램 ID로 직접 이미지 URL 반환 */
export function getImageById(id: number, size: 300 | 500 | 2500 = 500): string | null {
  if (!isValidArasaacId(id)) return null;
  return `${ARASAAC_IMG}/${id}/${id}_${size}.png`;
}

/** 이미지 URL 생성 */
export function getImageUrl(id: number, size: 300 | 500 | 2500 = 500): string | null {
  if (!isValidArasaacId(id)) return null;
  const url = `${ARASAAC_IMG}/${id}/${id}_${size}.png`;
  return isValidArasaacUrl(url) ? url : null;
}

/** 키워드로 이미지 URL 가져오기 */
export async function getImageByKeyword(keyword: string): Promise<string | null> {
  const id = await searchPictogramId(keyword);
  if (!id) return null;
  return getImageUrl(id);
}

/** 여러 카드 이미지 일괄 로드 */
export async function preloadImages(
  cards: { arasaacKeyword?: string }[],
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const uncached: string[] = [];

  for (const card of cards) {
    const keyword = sanitizeKeyword(card.arasaacKeyword || '');
    if (!keyword) continue;

    if (memoryCache[keyword] !== undefined && memoryCache[keyword] !== null) {
      const url = getImageUrl(memoryCache[keyword]!);
      if (url) results.set(keyword, url);
    } else if (memoryCache[keyword] === undefined) {
      uncached.push(keyword);
    }
  }

  const batchSize = 5;
  for (let i = 0; i < uncached.length; i += batchSize) {
    const batch = uncached.slice(i, i + batchSize);
    const promises = batch.map(async (keyword) => {
      const id = await searchPictogramId(keyword);
      if (id) {
        const url = getImageUrl(id);
        if (url) results.set(keyword, url);
      }
    });
    await Promise.allSettled(promises);

    if (i + batchSize < uncached.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  saveCache(memoryCache);
  return results;
}

/** 캐시 초기화 */
export function clearCache(): void {
  memoryCache = {};
  localStorage.removeItem(CACHE_KEY);
}

/** 폴백 SVG 데이터 URL */
export function getFallbackSvg(text: string, category: string): string {
  const colors: Record<string, { bg: string; fg: string }> = {
    person:     { bg: '#FAF5FF', fg: '#9333EA' },
    action:     { bg: '#F0FDF4', fg: '#16A34A' },
    feeling:    { bg: '#EFF6FF', fg: '#2563EB' },
    food:       { bg: '#FFF7ED', fg: '#EA580C' },
    place:      { bg: '#ECFEFF', fg: '#0891B2' },
    thing:      { bg: '#FFF7ED', fg: '#EA580C' },
    time:       { bg: '#FEF9C3', fg: '#A16207' },
    expression: { bg: '#F9FAFB', fg: '#6B7280' },
    emergency:  { bg: '#FEF2F2', fg: '#DC2626' },
  };
  const c = colors[category] || colors.expression;
  const firstChar = (text || '?').charAt(0).replace(/[<>&"']/g, '');

  const svg = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="${c.bg}"/><text x="32" y="38" text-anchor="middle" font-size="24" font-weight="bold" fill="${c.fg}" font-family="sans-serif">${firstChar}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
