/* ========================================
   pictograms.js - ARASAAC 이미지 로더 (v4.0)

   ARASAAC 픽토그램 (CC BY-NC-SA)
   Pictographic symbols are property of the Government of Aragón
   and have been created by Sergio Palao for ARASAAC.
   https://arasaac.org/

   [보안]
   - API 응답 검증 (ID는 반드시 숫자)
   - 이미지 URL은 ARASAAC 도메인만 허용
   - 사용자 입력 키워드 sanitize
   - localStorage JSON parse 에러 처리
======================================== */

const ARASAAC_API = 'https://api.arasaac.org/v1/pictograms/ko/search';
const ARASAAC_IMG = 'https://static.arasaac.org/pictograms';
const CACHE_KEY = 'aac_arasaac_cache';
const CACHE_VERSION = 1;

// ========== 보안: 입력 검증 ==========

/** 키워드 sanitize - XSS 방지 */
function sanitizeKeyword(keyword) {
    if (typeof keyword !== 'string') return '';
    // 한글, 영문, 숫자, 공백만 허용
    return keyword.replace(/[^\uAC00-\uD7A3\u3131-\u3163a-zA-Z0-9\s]/g, '').trim().slice(0, 50);
}

/** ARASAAC ID 검증 - 반드시 양의 정수 */
function isValidArasaacId(id) {
    return Number.isInteger(id) && id > 0 && id < 100000;
}

/** URL 검증 - ARASAAC 도메인만 허용 */
function isValidArasaacUrl(url) {
    try {
        const parsed = new URL(url);
        return parsed.hostname === 'static.arasaac.org';
    } catch {
        return false;
    }
}

// ========== 캐시 관리 ==========

/** 캐시 로드 (localStorage) */
function loadCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === CACHE_VERSION && typeof parsed.data === 'object') {
            return parsed.data;
        }
        // 버전 불일치 시 캐시 초기화
        localStorage.removeItem(CACHE_KEY);
        return {};
    } catch {
        // JSON parse 실패 시 캐시 초기화
        localStorage.removeItem(CACHE_KEY);
        return {};
    }
}

/** 캐시 저장 */
function saveCache(cache) {
    try {
        const data = JSON.stringify({ version: CACHE_VERSION, data: cache });
        // localStorage 용량 체크 (5MB 제한 대비)
        if (data.length > 1024 * 1024) {
            console.warn('[ARASAAC] 캐시 용량 초과, 초기화');
            localStorage.removeItem(CACHE_KEY);
            return;
        }
        localStorage.setItem(CACHE_KEY, data);
    } catch (e) {
        console.warn('[ARASAAC] 캐시 저장 실패:', e.message);
    }
}

// ========== 내부 캐시 (메모리) ==========
let memoryCache = loadCache();

// ========== API 호출 ==========

/**
 * ARASAAC API에서 키워드로 픽토그램 ID 검색
 * @param {string} keyword - 한국어 검색어
 * @returns {Promise<number|null>} 픽토그램 ID 또는 null
 */
async function searchPictogramId(keyword) {
    const safe = sanitizeKeyword(keyword);
    if (!safe) return null;

    // 메모리 캐시 확인
    if (memoryCache[safe] !== undefined) {
        return memoryCache[safe];
    }

    try {
        const encoded = encodeURIComponent(safe);
        const response = await fetch(`${ARASAAC_API}/${encoded}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(5000) // 5초 타임아웃
        });

        if (!response.ok) {
            memoryCache[safe] = null;
            return null;
        }

        const data = await response.json();

        // 응답 검증
        if (!Array.isArray(data) || data.length === 0) {
            memoryCache[safe] = null;
            return null;
        }

        // 첫 번째 결과의 ID 사용
        const id = data[0]._id;
        if (!isValidArasaacId(id)) {
            memoryCache[safe] = null;
            return null;
        }

        memoryCache[safe] = id;
        return id;
    } catch (e) {
        // 네트워크 오류, 타임아웃 등
        console.warn(`[ARASAAC] 검색 실패 (${safe}):`, e.message);
        return null;
    }
}

// ========== 공개 API ==========

/**
 * ARASAAC 이미지 URL 생성
 * @param {number} id - 픽토그램 ID
 * @param {number} size - 이미지 크기 (300, 500, 2500)
 * @returns {string|null} 이미지 URL
 */
export function getImageUrl(id, size = 500) {
    if (!isValidArasaacId(id)) return null;
    const validSizes = [300, 500, 2500];
    const safeSize = validSizes.includes(size) ? size : 500;
    const url = `${ARASAAC_IMG}/${id}/${id}_${safeSize}.png`;
    return isValidArasaacUrl(url) ? url : null;
}

/**
 * 키워드로 ARASAAC 이미지 URL 가져오기
 * @param {string} keyword - 한국어 검색어
 * @returns {Promise<string|null>} 이미지 URL 또는 null
 */
export async function getImageByKeyword(keyword) {
    const id = await searchPictogramId(keyword);
    if (!id) return null;
    return getImageUrl(id);
}

/**
 * 여러 카드의 ARASAAC 이미지를 일괄 로드
 * @param {Array} cards - { arasaacKeyword } 포함된 카드 배열
 * @returns {Promise<Map<string, string>>} keyword → imageUrl 매핑
 */
export async function preloadImages(cards) {
    const results = new Map();
    const uncached = [];

    // 캐시된 것 먼저 처리
    for (const card of cards) {
        const keyword = sanitizeKeyword(card.arasaacKeyword || '');
        if (!keyword) continue;

        if (memoryCache[keyword] !== undefined && memoryCache[keyword] !== null) {
            const url = getImageUrl(memoryCache[keyword]);
            if (url) results.set(keyword, url);
        } else if (memoryCache[keyword] === undefined) {
            uncached.push(keyword);
        }
    }

    // 캐시 안 된 것들 병렬 로드 (최대 5개씩)
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

        // 배치 간 딜레이 (API 부하 방지)
        if (i + batchSize < uncached.length) {
            await new Promise(r => setTimeout(r, 200));
        }
    }

    // 캐시 저장
    saveCache(memoryCache);

    return results;
}

/**
 * 캐시 초기화
 */
export function clearCache() {
    memoryCache = {};
    localStorage.removeItem(CACHE_KEY);
}

/**
 * 폴백 SVG 생성 (ARASAAC 로드 실패 시)
 * @param {string} text - 카드 텍스트
 * @param {string} category - 카테고리 ID
 * @returns {string} SVG 문자열
 */
export function getFallbackSvg(text, category) {
    const colors = {
        person:     { bg: '#FAF5FF', fg: '#9333EA' },
        action:     { bg: '#F0FDF4', fg: '#16A34A' },
        feeling:    { bg: '#EFF6FF', fg: '#2563EB' },
        food:       { bg: '#FFF7ED', fg: '#EA580C' },
        place:      { bg: '#ECFEFF', fg: '#0891B2' },
        thing:      { bg: '#FFF7ED', fg: '#EA580C' },
        time:       { bg: '#FEF9C3', fg: '#A16207' },
        expression: { bg: '#F9FAFB', fg: '#6B7280' },
        emergency:  { bg: '#FEF2F2', fg: '#DC2626' }
    };
    const c = colors[category] || colors.expression;
    // 텍스트에서 첫 글자 추출 (XSS 방지: SVG 내 텍스트는 escape 처리)
    const firstChar = (text || '?').charAt(0);
    const safeChar = firstChar.replace(/[<>&"']/g, '');

    return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="30" fill="${c.bg}"/>
        <text x="32" y="38" text-anchor="middle" font-size="24" font-weight="bold" fill="${c.fg}" font-family="sans-serif">${safeChar}</text>
    </svg>`;
}
