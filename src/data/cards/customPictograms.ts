// ========================================
// customPictograms.ts - ARASAAC에 없는 한국 고유 항목용 커스텀 SVG
// 김치, 배부르다 등 한국 문화 고유 개념
// ========================================

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg.trim())}`;
}

/** 김치 - 빨간 김치 항아리 */
export const KIMCHI_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect x="16" y="28" width="32" height="28" rx="4" fill="#D84315"/>
  <rect x="16" y="24" width="32" height="8" rx="2" fill="#BF360C"/>
  <rect x="20" y="18" width="24" height="10" rx="3" fill="#8D6E63"/>
  <ellipse cx="28" cy="38" rx="5" ry="7" fill="#7CB342" opacity="0.8"/>
  <ellipse cx="36" cy="40" rx="4" ry="6" fill="#8BC34A" opacity="0.7"/>
  <ellipse cx="32" cy="46" rx="5" ry="5" fill="#9CCC65" opacity="0.6"/>
  <path d="M28 34 Q26 38 28 42" fill="none" stroke="#558B2F" stroke-width="1"/>
  <path d="M36 36 Q34 40 36 44" fill="none" stroke="#558B2F" stroke-width="1"/>
</svg>`);

/** 배부르다 - 배를 잡고 만족한 표정 */
export const FULL_STOMACH_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="18" r="12" fill="#FFCC80"/>
  <path d="M26 16 Q28 13 30 16" fill="none" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M34 16 Q36 13 38 16" fill="none" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M26 22 Q32 27 38 22" fill="none" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round"/>
  <ellipse cx="32" cy="44" rx="14" ry="16" fill="#42A5F5"/>
  <ellipse cx="32" cy="46" rx="10" ry="10" fill="#90CAF9"/>
  <ellipse cx="38" cy="44" rx="4" ry="3" fill="#FFCC80" transform="rotate(-10 38 44)"/>
</svg>`);

/** 반찬 - 여러 개의 작은 접시 */
export const SIDE_DISH_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="22" cy="26" rx="12" ry="6" fill="#E0E0E0"/>
  <ellipse cx="22" cy="24" rx="10" ry="4" fill="#FFF9C4"/>
  <rect x="17" y="20" width="10" height="4" rx="2" fill="#8BC34A"/>
  <ellipse cx="42" cy="26" rx="12" ry="6" fill="#E0E0E0"/>
  <ellipse cx="42" cy="24" rx="10" ry="4" fill="#FFF9C4"/>
  <circle cx="40" cy="23" r="3" fill="#EF5350"/>
  <circle cx="45" cy="24" r="2" fill="#FF8A65"/>
  <ellipse cx="32" cy="46" rx="14" ry="7" fill="#E0E0E0"/>
  <ellipse cx="32" cy="44" rx="12" ry="5" fill="#FFF9C4"/>
  <rect x="27" y="41" width="4" height="3" rx="1" fill="#795548"/>
  <rect x="33" y="42" width="4" height="2" rx="1" fill="#4CAF50"/>
</svg>`);

/** 라면 - 그릇에 담긴 면과 김 */
export const RAMEN_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 30 Q12 54 32 54 Q52 54 52 30 Z" fill="#FFF3E0"/>
  <path d="M10 30 L54 30" stroke="#FF6F00" stroke-width="3" stroke-linecap="round"/>
  <path d="M20 36 Q24 42 28 36 Q32 42 36 36 Q40 42 44 36" fill="none" stroke="#FDD835" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M18 42 Q22 48 26 42 Q30 48 34 42 Q38 48 42 42" fill="none" stroke="#FDD835" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="38" cy="34" rx="3" ry="2" fill="#EF5350"/>
  <path d="M22 26 Q20 18 24 14" fill="none" stroke="#BDBDBD" stroke-width="1.5" opacity="0.6"/>
  <path d="M32 24 Q30 16 34 12" fill="none" stroke="#BDBDBD" stroke-width="1.5" opacity="0.6"/>
  <path d="M42 26 Q40 18 44 14" fill="none" stroke="#BDBDBD" stroke-width="1.5" opacity="0.6"/>
</svg>`);

/** 밥 - 밥그릇에 담긴 흰쌀밥 + 젓가락 */
export const RICE_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 32 Q12 54 32 54 Q52 54 52 32 Z" fill="#E0E0E0"/>
  <path d="M10 32 L54 32" stroke="#9E9E9E" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="32" cy="30" rx="18" ry="6" fill="#FAFAFA"/>
  <ellipse cx="28" cy="28" rx="3" ry="2" fill="#F5F5F5"/>
  <ellipse cx="36" cy="29" rx="3" ry="2" fill="#F5F5F5"/>
  <ellipse cx="32" cy="27" rx="2" ry="1.5" fill="#F5F5F5"/>
  <line x1="44" y1="12" x2="50" y2="32" stroke="#795548" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="48" y1="12" x2="52" y2="32" stroke="#795548" stroke-width="1.5" stroke-linecap="round"/>
</svg>`);
