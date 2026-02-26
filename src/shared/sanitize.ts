// ========================================
// sanitize.ts - 입력 살균, XSS 방지
// ========================================

/** 키워드 sanitize - 한글, 영문, 숫자, 공백만 허용 */
export function sanitizeKeyword(keyword: string): string {
  if (typeof keyword !== 'string') return '';
  return keyword
    .replace(/[^\uAC00-\uD7A3\u3131-\u3163a-zA-Z0-9\s]/g, '')
    .trim()
    .slice(0, 50);
}

/** ARASAAC ID 검증 - 반드시 양의 정수 */
export function isValidArasaacId(id: number): boolean {
  return Number.isInteger(id) && id > 0 && id < 100000;
}

/** URL 검증 - ARASAAC 도메인만 허용 */
export function isValidArasaacUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'static.arasaac.org';
  } catch {
    return false;
  }
}

/** 일반 텍스트 sanitize - HTML 태그 제거 */
export function sanitizeText(text: string): string {
  if (typeof text !== 'string') return '';
  return text.replace(/[<>&"']/g, '').trim().slice(0, 100);
}

/** 카드 텍스트 검증 */
export function isValidCardText(text: string): boolean {
  const sanitized = sanitizeText(text);
  return sanitized.length > 0 && sanitized.length <= 50;
}
