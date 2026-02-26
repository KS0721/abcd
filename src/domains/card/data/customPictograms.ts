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

// ========================================
// 한국 음식 커스텀 SVG (ARASAAC 미지원)
// ========================================

/** 떡볶이 - 빨간 양념의 가래떡과 어묵, 대접에 담김 */
export const TTEOKBOKKI_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 대접 -->
  <path d="M8 32 Q8 56 32 56 Q56 56 56 32 Z" fill="#F5F5F5"/>
  <path d="M8 32 Q8 28 32 28 Q56 28 56 32" fill="#E0E0E0"/>
  <path d="M6 32 L58 32" stroke="#BDBDBD" stroke-width="2" stroke-linecap="round"/>
  <!-- 빨간 양념 소스 -->
  <ellipse cx="32" cy="38" rx="20" ry="10" fill="#D32F2F" opacity="0.85"/>
  <!-- 가래떡 (흰색 원통형) -->
  <rect x="16" y="33" width="14" height="5" rx="2.5" fill="#FFF8E1" stroke="#E0C080" stroke-width="0.5"/>
  <rect x="22" y="37" width="16" height="5" rx="2.5" fill="#FFF8E1" stroke="#E0C080" stroke-width="0.5" transform="rotate(-15 30 39)"/>
  <rect x="33" y="34" width="13" height="5" rx="2.5" fill="#FFF8E1" stroke="#E0C080" stroke-width="0.5" transform="rotate(10 39 36)"/>
  <rect x="18" y="40" width="12" height="4.5" rx="2.2" fill="#FFF8E1" stroke="#E0C080" stroke-width="0.5" transform="rotate(20 24 42)"/>
  <!-- 어묵 (삼각형) -->
  <polygon points="40,35 46,44 34,44" fill="#FFCC80" stroke="#E0A050" stroke-width="0.5"/>
  <!-- 파 (초록색 고명) -->
  <ellipse cx="24" cy="35" rx="2" ry="1" fill="#4CAF50"/>
  <ellipse cx="38" cy="42" rx="1.5" ry="0.8" fill="#66BB6A"/>
  <ellipse cx="30" cy="44" rx="1.8" ry="0.9" fill="#4CAF50"/>
  <!-- 깨 -->
  <circle cx="28" cy="36" r="0.5" fill="#FFF9C4"/>
  <circle cx="35" cy="38" r="0.5" fill="#FFF9C4"/>
  <circle cx="42" cy="40" r="0.5" fill="#FFF9C4"/>
  <!-- 김이 모락모락 -->
  <path d="M20 26 Q18 20 22 16" fill="none" stroke="#BDBDBD" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
  <path d="M32 24 Q30 18 34 14" fill="none" stroke="#BDBDBD" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
  <path d="M44 26 Q42 20 46 16" fill="none" stroke="#BDBDBD" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
</svg>`);

/** 김밥 - 단면이 보이는 김밥 두 줄, 김+밥+속재료 */
export const GIMBAP_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 김밥 줄 1 (뒤쪽, 약간 위) -->
  <ellipse cx="22" cy="22" rx="13" ry="13" fill="#1B5E20"/>
  <ellipse cx="22" cy="22" rx="11.5" ry="11.5" fill="#FFFDE7"/>
  <!-- 속재료 줄 1 -->
  <circle cx="22" cy="17" r="2.5" fill="#FF8F00"/>  <!-- 단무지 -->
  <ellipse cx="17" cy="22" rx="2" ry="2.5" fill="#D84315"/>  <!-- 당근 -->
  <ellipse cx="27" cy="21" rx="2" ry="2.8" fill="#4CAF50"/>  <!-- 시금치 -->
  <rect x="19" y="24" width="6" height="3" rx="1" fill="#795548"/>  <!-- 우엉 -->
  <circle cx="22" cy="22" r="1.8" fill="#FFEB3B"/>  <!-- 계란 -->
  <ellipse cx="25" cy="27" rx="2.2" ry="1.5" fill="#EF5350"/>  <!-- 햄 -->
  <!-- 김밥 줄 2 (앞쪽, 아래) -->
  <ellipse cx="40" cy="40" rx="13" ry="13" fill="#1B5E20"/>
  <ellipse cx="40" cy="40" rx="11.5" ry="11.5" fill="#FFFDE7"/>
  <!-- 속재료 줄 2 -->
  <circle cx="40" cy="35" r="2.5" fill="#FF8F00"/>  <!-- 단무지 -->
  <ellipse cx="35" cy="40" rx="2" ry="2.5" fill="#D84315"/>  <!-- 당근 -->
  <ellipse cx="45" cy="39" rx="2" ry="2.8" fill="#4CAF50"/>  <!-- 시금치 -->
  <rect x="37" y="42" width="6" height="3" rx="1" fill="#795548"/>  <!-- 우엉 -->
  <circle cx="40" cy="40" r="1.8" fill="#FFEB3B"/>  <!-- 계란 -->
  <ellipse cx="43" cy="45" rx="2.2" ry="1.5" fill="#EF5350"/>  <!-- 햄 -->
  <!-- 김 반짝임 -->
  <path d="M10 17 Q12 15 14 17" fill="none" stroke="#2E7D32" stroke-width="0.5" opacity="0.4"/>
  <path d="M28 34 Q30 32 32 34" fill="none" stroke="#2E7D32" stroke-width="0.5" opacity="0.4"/>
</svg>`);

/** 비빔밥 - 큰 그릇에 오색 나물과 계란후라이 */
export const BIBIMBAP_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 돌솥/큰 그릇 -->
  <path d="M6 30 Q6 58 32 58 Q58 58 58 30 Z" fill="#5D4037"/>
  <path d="M6 30 Q6 26 32 26 Q58 26 58 30" fill="#4E342E"/>
  <path d="M4 30 L60 30" stroke="#3E2723" stroke-width="2.5" stroke-linecap="round"/>
  <!-- 흰 밥 바닥 -->
  <ellipse cx="32" cy="40" rx="22" ry="13" fill="#FFFDE7"/>
  <!-- 시금치 (초록, 위쪽) -->
  <path d="M20 33 Q26 30 32 33" fill="#2E7D32"/>
  <path d="M21 34 Q26 31 31 34" fill="#388E3C"/>
  <!-- 당근 (주황, 오른쪽위) -->
  <path d="M34 33 Q40 30 46 34" fill="#E65100"/>
  <path d="M35 34 Q40 31 45 35" fill="#FF8F00"/>
  <!-- 콩나물 (노란, 왼쪽) -->
  <path d="M14 38 Q18 35 22 39" fill="#FDD835"/>
  <path d="M15 39 Q18 36 21 40" fill="#FFEE58"/>
  <!-- 고사리 (갈색, 오른쪽) -->
  <path d="M42 38 Q46 35 50 39" fill="#6D4C41"/>
  <path d="M43 39 Q46 36 49 40" fill="#8D6E63"/>
  <!-- 김치/고추장 빨강 (아래) -->
  <path d="M22 44 Q32 42 42 45" fill="#C62828"/>
  <path d="M24 45 Q32 43 40 46" fill="#E53935"/>
  <!-- 계란후라이 (가운데) -->
  <ellipse cx="32" cy="38" rx="6" ry="5" fill="white"/>
  <circle cx="32" cy="37.5" r="3" fill="#FFD600"/>
  <ellipse cx="33" cy="37" rx="1" ry="0.8" fill="#FFFF00" opacity="0.6"/>
  <!-- 참기름 광택 -->
  <ellipse cx="26" cy="36" rx="1.5" ry="0.8" fill="white" opacity="0.3"/>
  <ellipse cx="38" cy="43" rx="1" ry="0.5" fill="white" opacity="0.25"/>
  <!-- 김 -->
  <path d="M18 26 Q16 20 20 16" fill="none" stroke="#BDBDBD" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
  <path d="M32 24 Q30 18 34 14" fill="none" stroke="#BDBDBD" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
  <path d="M46 26 Q44 20 48 16" fill="none" stroke="#BDBDBD" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
</svg>`);

/** 불고기 - 접시 위의 양념 고기와 채소 */
export const BULGOGI_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 접시 -->
  <ellipse cx="32" cy="44" rx="26" ry="12" fill="#E0E0E0"/>
  <ellipse cx="32" cy="42" rx="24" ry="10" fill="#F5F5F5"/>
  <ellipse cx="32" cy="42" rx="20" ry="8" fill="#FFF8E1"/>
  <!-- 불고기 고기 조각들 (갈색+빨간 양념) -->
  <path d="M18 38 Q22 34 28 37 Q24 40 18 38Z" fill="#5D4037"/>
  <path d="M19 39 Q23 35 27 38" fill="none" stroke="#BF360C" stroke-width="1" opacity="0.7"/>
  <path d="M26 36 Q32 32 38 36 Q34 40 26 36Z" fill="#6D4C41"/>
  <path d="M27 37 Q32 33 37 37" fill="none" stroke="#BF360C" stroke-width="1" opacity="0.7"/>
  <path d="M34 38 Q40 34 46 38 Q42 42 34 38Z" fill="#4E342E"/>
  <path d="M35 39 Q40 35 45 39" fill="none" stroke="#BF360C" stroke-width="1" opacity="0.7"/>
  <path d="M22 42 Q28 38 34 42 Q30 46 22 42Z" fill="#5D4037"/>
  <path d="M36 42 Q42 38 46 43 Q42 46 36 42Z" fill="#6D4C41"/>
  <!-- 양파 -->
  <path d="M20 40 Q22 38 24 40" fill="none" stroke="white" stroke-width="1.5" opacity="0.7"/>
  <path d="M38 44 Q40 42 42 44" fill="none" stroke="white" stroke-width="1.5" opacity="0.7"/>
  <!-- 파 고명 -->
  <ellipse cx="30" cy="40" rx="2" ry="0.8" fill="#4CAF50"/>
  <ellipse cx="40" cy="39" rx="1.5" ry="0.6" fill="#66BB6A"/>
  <!-- 깨 -->
  <circle cx="25" cy="38" r="0.4" fill="#FFF9C4"/>
  <circle cx="33" cy="37" r="0.4" fill="#FFF9C4"/>
  <circle cx="41" cy="41" r="0.4" fill="#FFF9C4"/>
  <!-- 김 -->
  <path d="M22 30 Q20 24 24 20" fill="none" stroke="#BDBDBD" stroke-width="1" opacity="0.4" stroke-linecap="round"/>
  <path d="M38 30 Q36 24 40 20" fill="none" stroke="#BDBDBD" stroke-width="1" opacity="0.4" stroke-linecap="round"/>
</svg>`);

/** 삼겹살 - 불판 위에 구워지는 고기와 상추 */
export const SAMGYEOPSAL_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 불판 (원형 그릴) -->
  <ellipse cx="32" cy="38" rx="28" ry="18" fill="#424242"/>
  <ellipse cx="32" cy="36" rx="26" ry="16" fill="#616161"/>
  <!-- 석쇠 격자 -->
  <line x1="12" y1="36" x2="52" y2="36" stroke="#757575" stroke-width="0.8"/>
  <line x1="14" y1="30" x2="50" y2="30" stroke="#757575" stroke-width="0.8"/>
  <line x1="14" y1="42" x2="50" y2="42" stroke="#757575" stroke-width="0.8"/>
  <line x1="22" y1="22" x2="22" y2="50" stroke="#757575" stroke-width="0.8"/>
  <line x1="32" y1="20" x2="32" y2="52" stroke="#757575" stroke-width="0.8"/>
  <line x1="42" y1="22" x2="42" y2="50" stroke="#757575" stroke-width="0.8"/>
  <!-- 삼겹살 고기 줄 1 (지방+살 줄무늬) -->
  <rect x="14" y="26" width="18" height="7" rx="1.5" fill="#D7837F"/>
  <rect x="14" y="28" width="18" height="1.5" rx="0.5" fill="#FFF3E0" opacity="0.8"/>
  <rect x="14" y="31" width="18" height="1" rx="0.5" fill="#FFF3E0" opacity="0.6"/>
  <!-- 삼겹살 고기 줄 2 -->
  <rect x="28" y="34" width="20" height="7" rx="1.5" fill="#C96B67" transform="rotate(-8 38 37)"/>
  <rect x="28" y="36" width="20" height="1.5" rx="0.5" fill="#FFF3E0" opacity="0.8" transform="rotate(-8 38 37)"/>
  <rect x="28" y="39" width="20" height="1" rx="0.5" fill="#FFF3E0" opacity="0.6" transform="rotate(-8 38 37)"/>
  <!-- 삼겹살 고기 줄 3 (작은 조각) -->
  <rect x="16" y="38" width="14" height="6" rx="1.5" fill="#E09590" transform="rotate(5 23 41)"/>
  <rect x="16" y="40" width="14" height="1.2" rx="0.5" fill="#FFF3E0" opacity="0.7" transform="rotate(5 23 41)"/>
  <!-- 마늘 -->
  <ellipse cx="44" cy="28" rx="2.5" ry="2" fill="#FFF9C4"/>
  <ellipse cx="47" cy="30" rx="2" ry="1.5" fill="#FFF9C4"/>
  <!-- 구운 자국 -->
  <line x1="16" y1="27" x2="30" y2="27" stroke="#8D6E63" stroke-width="0.5" opacity="0.5"/>
  <line x1="30" y1="35" x2="46" y2="35" stroke="#8D6E63" stroke-width="0.5" opacity="0.5"/>
  <!-- 연기 -->
  <path d="M18 20 Q16 14 20 10" fill="none" stroke="#BDBDBD" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
  <path d="M32 18 Q30 12 34 8" fill="none" stroke="#BDBDBD" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
  <path d="M46 20 Q44 14 48 10" fill="none" stroke="#BDBDBD" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
</svg>`);

/** 된장찌개 - 뚝배기에 끓는 된장찌개 */
export const DOENJANG_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 뚝배기 (갈색 토기) -->
  <path d="M10 30 Q10 58 32 58 Q54 58 54 30 Z" fill="#5D4037"/>
  <path d="M8 30 Q8 28 10 28 L54 28 Q56 28 56 30 L56 32 Q56 34 54 34 L10 34 Q8 34 8 32 Z" fill="#4E342E"/>
  <!-- 뚝배기 귀 (손잡이) -->
  <rect x="2" y="28" width="8" height="5" rx="2" fill="#6D4C41"/>
  <rect x="54" y="28" width="8" height="5" rx="2" fill="#6D4C41"/>
  <!-- 된장 국물 -->
  <ellipse cx="32" cy="40" rx="20" ry="12" fill="#F9A825"/>
  <ellipse cx="32" cy="38" rx="18" ry="10" fill="#FFB300"/>
  <!-- 두부 조각 -->
  <rect x="20" y="36" width="7" height="6" rx="1" fill="#FFFDE7" stroke="#E0C080" stroke-width="0.5"/>
  <rect x="36" y="38" width="6" height="5" rx="1" fill="#FFFDE7" stroke="#E0C080" stroke-width="0.5"/>
  <!-- 호박 -->
  <ellipse cx="30" cy="43" rx="3" ry="2" fill="#7CB342"/>
  <ellipse cx="42" cy="40" rx="2.5" ry="1.8" fill="#8BC34A"/>
  <!-- 고추 -->
  <path d="M24 38 Q26 36 28 38" fill="#E53935" stroke="#C62828" stroke-width="0.5"/>
  <path d="M38 36 Q40 34 42 36" fill="#43A047" stroke="#2E7D32" stroke-width="0.5"/>
  <!-- 파 -->
  <ellipse cx="34" cy="37" rx="2" ry="0.8" fill="#4CAF50"/>
  <!-- 보글보글 거품 -->
  <circle cx="22" cy="36" r="1.5" fill="white" opacity="0.5"/>
  <circle cx="28" cy="34" r="1.8" fill="white" opacity="0.4"/>
  <circle cx="38" cy="35" r="1.3" fill="white" opacity="0.5"/>
  <circle cx="44" cy="37" r="1" fill="white" opacity="0.4"/>
  <circle cx="32" cy="33" r="2" fill="white" opacity="0.35"/>
  <!-- 김 모락모락 -->
  <path d="M20 24 Q18 18 22 14" fill="none" stroke="#BDBDBD" stroke-width="1.5" opacity="0.5" stroke-linecap="round"/>
  <path d="M32 22 Q30 16 34 12" fill="none" stroke="#BDBDBD" stroke-width="1.5" opacity="0.5" stroke-linecap="round"/>
  <path d="M44 24 Q42 18 46 14" fill="none" stroke="#BDBDBD" stroke-width="1.5" opacity="0.5" stroke-linecap="round"/>
</svg>`);

// ========================================
// 한국 음식 추가 (ARASAAC 미지원)
// ========================================

/** 떡 - 하얀 가래떡/절편 */
export const TTEOK_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 접시 -->
  <ellipse cx="32" cy="48" rx="26" ry="10" fill="#E0E0E0"/>
  <ellipse cx="32" cy="46" rx="24" ry="8" fill="#F5F5F5"/>
  <!-- 절편 (네모난 떡 여러 조각) -->
  <rect x="14" y="34" width="12" height="10" rx="2" fill="#FFFDE7" stroke="#E0C080" stroke-width="0.8"/>
  <rect x="28" y="32" width="12" height="12" rx="2" fill="#FFF8E1" stroke="#E0C080" stroke-width="0.8"/>
  <rect x="42" y="34" width="10" height="10" rx="2" fill="#FFFDE7" stroke="#E0C080" stroke-width="0.8"/>
  <!-- 가래떡 (원통형) -->
  <rect x="16" y="26" width="30" height="6" rx="3" fill="#FFF8E1" stroke="#D7CCC8" stroke-width="0.8"/>
  <!-- 참깨 장식 -->
  <circle cx="22" cy="38" r="0.6" fill="#8D6E63"/>
  <circle cx="34" cy="37" r="0.6" fill="#8D6E63"/>
  <circle cx="46" cy="38" r="0.6" fill="#8D6E63"/>
  <!-- 꿀/조청 -->
  <ellipse cx="25" cy="40" rx="3" ry="1" fill="#FFA000" opacity="0.4"/>
</svg>`);

/** 냉면 - 대접에 담긴 냉면과 얼음 */
export const NAENGMYEON_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 대접 -->
  <path d="M8 30 Q8 56 32 56 Q56 56 56 30 Z" fill="#E3F2FD"/>
  <path d="M6 30 L58 30" stroke="#90CAF9" stroke-width="2.5" stroke-linecap="round"/>
  <!-- 육수 (차가운 느낌) -->
  <ellipse cx="32" cy="42" rx="22" ry="12" fill="#BBDEFB"/>
  <!-- 면 -->
  <path d="M18 36 Q22 42 26 36 Q30 42 34 36 Q38 42 42 36" fill="none" stroke="#D7CCC8" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M16 42 Q20 48 24 42 Q28 48 32 42 Q36 48 40 42" fill="none" stroke="#D7CCC8" stroke-width="2.5" stroke-linecap="round"/>
  <!-- 삶은 계란 반쪽 -->
  <ellipse cx="40" cy="36" rx="5" ry="3.5" fill="white" stroke="#E0E0E0" stroke-width="0.5"/>
  <ellipse cx="40" cy="36" rx="2.5" ry="1.8" fill="#FFD600"/>
  <!-- 오이 -->
  <rect x="20" y="33" width="8" height="3" rx="1" fill="#66BB6A" transform="rotate(-15 24 34)"/>
  <!-- 얼음 조각 -->
  <rect x="14" y="37" width="5" height="4" rx="1" fill="white" opacity="0.7" stroke="#90CAF9" stroke-width="0.5"/>
  <rect x="44" y="39" width="4" height="4" rx="1" fill="white" opacity="0.7" stroke="#90CAF9" stroke-width="0.5"/>
</svg>`);

/** 볶음밥 - 접시 위의 볶음밥 */
export const FRIEDRICE_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 접시 -->
  <ellipse cx="32" cy="46" rx="26" ry="12" fill="#E0E0E0"/>
  <ellipse cx="32" cy="44" rx="24" ry="10" fill="#F5F5F5"/>
  <!-- 볶음밥 돔 -->
  <path d="M14 44 Q14 28 32 26 Q50 28 50 44" fill="#FFB74D"/>
  <path d="M16 42 Q16 30 32 28 Q48 30 48 42" fill="#FFA726"/>
  <!-- 밥알 텍스처 -->
  <ellipse cx="24" cy="36" rx="2" ry="1" fill="#FFECB3" opacity="0.7"/>
  <ellipse cx="32" cy="34" rx="2" ry="1" fill="#FFECB3" opacity="0.7"/>
  <ellipse cx="38" cy="38" rx="2" ry="1" fill="#FFECB3" opacity="0.7"/>
  <ellipse cx="28" cy="40" rx="1.5" ry="0.8" fill="#FFECB3" opacity="0.7"/>
  <!-- 당근 조각 -->
  <rect x="22" y="34" width="3" height="3" rx="0.5" fill="#E65100"/>
  <rect x="36" y="36" width="2.5" height="2.5" rx="0.5" fill="#E65100"/>
  <!-- 파 -->
  <ellipse cx="30" cy="38" rx="2" ry="0.8" fill="#4CAF50"/>
  <ellipse cx="42" cy="36" rx="1.5" ry="0.6" fill="#66BB6A"/>
  <!-- 계란 -->
  <ellipse cx="34" cy="32" rx="3" ry="2" fill="#FFF176" opacity="0.8"/>
  <!-- 김 -->
  <path d="M24 26 Q22 20 26 16" fill="none" stroke="#BDBDBD" stroke-width="1" opacity="0.4" stroke-linecap="round"/>
  <path d="M38 26 Q36 20 40 16" fill="none" stroke="#BDBDBD" stroke-width="1" opacity="0.4" stroke-linecap="round"/>
</svg>`);

/** 죽 - 뚝배기에 담긴 죽 */
export const PORRIDGE_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 뚝배기 -->
  <path d="M12 32 Q12 56 32 56 Q52 56 52 32 Z" fill="#8D6E63"/>
  <rect x="6" y="30" width="8" height="5" rx="2" fill="#795548"/>
  <rect x="50" y="30" width="8" height="5" rx="2" fill="#795548"/>
  <path d="M10 32 L54 32" stroke="#5D4037" stroke-width="2.5" stroke-linecap="round"/>
  <!-- 죽 (부드러운 크림색) -->
  <ellipse cx="32" cy="40" rx="18" ry="12" fill="#FFF8E1"/>
  <ellipse cx="32" cy="38" rx="16" ry="10" fill="#FFECB3"/>
  <!-- 참기름 방울 -->
  <circle cx="28" cy="38" r="1.5" fill="#FF8F00" opacity="0.5"/>
  <circle cx="36" cy="36" r="1" fill="#FF8F00" opacity="0.4"/>
  <!-- 파 고명 -->
  <ellipse cx="32" cy="37" rx="2" ry="0.8" fill="#4CAF50"/>
  <ellipse cx="38" cy="40" rx="1.5" ry="0.6" fill="#66BB6A"/>
  <!-- 깨 -->
  <circle cx="26" cy="40" r="0.5" fill="#5D4037"/>
  <circle cx="34" cy="42" r="0.5" fill="#5D4037"/>
  <!-- 김 모락모락 -->
  <path d="M22 26 Q20 20 24 16" fill="none" stroke="#BDBDBD" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
  <path d="M32 24 Q30 18 34 14" fill="none" stroke="#BDBDBD" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
  <path d="M42 26 Q40 20 44 16" fill="none" stroke="#BDBDBD" stroke-width="1.2" opacity="0.5" stroke-linecap="round"/>
</svg>`);

// ========================================
// 시간 개념 커스텀 SVG
// ========================================

/** 매일 - 달력에 매일 체크 표시 */
export const EVERYDAY_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 달력 -->
  <rect x="10" y="14" width="44" height="42" rx="3" fill="white" stroke="#424242" stroke-width="1.5"/>
  <rect x="10" y="14" width="44" height="10" rx="3" fill="#E53935"/>
  <rect x="10" y="21" width="44" height="3" fill="#E53935"/>
  <!-- 달력 고리 -->
  <rect x="20" y="10" width="3" height="8" rx="1" fill="#757575"/>
  <rect x="41" y="10" width="3" height="8" rx="1" fill="#757575"/>
  <!-- 날짜 체크 7x3 그리드 -->
  <path d="M16 30 L19 33 L23 28" fill="none" stroke="#4CAF50" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M26 30 L29 33 L33 28" fill="none" stroke="#4CAF50" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M36 30 L39 33 L43 28" fill="none" stroke="#4CAF50" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M16 38 L19 41 L23 36" fill="none" stroke="#4CAF50" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M26 38 L29 41 L33 36" fill="none" stroke="#4CAF50" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M36 38 L39 41 L43 36" fill="none" stroke="#4CAF50" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M16 46 L19 49 L23 44" fill="none" stroke="#4CAF50" stroke-width="1.8" stroke-linecap="round"/>
</svg>`);

/** 다음 주 - 달력 + 오른쪽 화살표 */
export const NEXT_WEEK_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 달력 -->
  <rect x="6" y="14" width="36" height="38" rx="3" fill="white" stroke="#424242" stroke-width="1.5"/>
  <rect x="6" y="14" width="36" height="10" rx="3" fill="#1976D2"/>
  <rect x="6" y="21" width="36" height="3" fill="#1976D2"/>
  <!-- 달력 고리 -->
  <rect x="14" y="10" width="3" height="8" rx="1" fill="#757575"/>
  <rect x="31" y="10" width="3" height="8" rx="1" fill="#757575"/>
  <!-- 주 표시 줄 -->
  <rect x="10" y="28" width="28" height="3" rx="1" fill="#E3F2FD"/>
  <rect x="10" y="34" width="28" height="3" rx="1" fill="#BBDEFB"/>
  <rect x="10" y="40" width="28" height="3" rx="1" fill="#E3F2FD"/>
  <!-- 오른쪽 화살표 (다음) -->
  <path d="M46 32 L58 32 M54 26 L60 32 L54 38" fill="none" stroke="#1976D2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

/** 지난주 - 달력 + 왼쪽 화살표 */
export const LAST_WEEK_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 왼쪽 화살표 (지난) -->
  <path d="M18 32 L6 32 M10 26 L4 32 L10 38" fill="none" stroke="#757575" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- 달력 -->
  <rect x="22" y="14" width="36" height="38" rx="3" fill="white" stroke="#424242" stroke-width="1.5"/>
  <rect x="22" y="14" width="36" height="10" rx="3" fill="#9E9E9E"/>
  <rect x="22" y="21" width="36" height="3" fill="#9E9E9E"/>
  <!-- 달력 고리 -->
  <rect x="30" y="10" width="3" height="8" rx="1" fill="#757575"/>
  <rect x="47" y="10" width="3" height="8" rx="1" fill="#757575"/>
  <!-- 주 표시 줄 -->
  <rect x="26" y="28" width="28" height="3" rx="1" fill="#F5F5F5"/>
  <rect x="26" y="34" width="28" height="3" rx="1" fill="#EEEEEE"/>
  <rect x="26" y="40" width="28" height="3" rx="1" fill="#F5F5F5"/>
</svg>`);

// ========================================
// 표현/부사 커스텀 SVG (추상 개념)
// ========================================

/** 아직 - 모래시계 절반 남음 */
export const YET_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 모래시계 프레임 -->
  <rect x="16" y="8" width="32" height="4" rx="2" fill="#795548"/>
  <rect x="16" y="52" width="32" height="4" rx="2" fill="#795548"/>
  <!-- 유리 -->
  <path d="M20 12 L20 24 Q32 36 44 24 L44 12 Z" fill="#E3F2FD" stroke="#90CAF9" stroke-width="1"/>
  <path d="M20 52 L20 40 Q32 28 44 40 L44 52 Z" fill="#E3F2FD" stroke="#90CAF9" stroke-width="1"/>
  <!-- 위쪽 모래 (절반 남음) -->
  <path d="M24 12 L24 20 Q32 28 40 20 L40 12 Z" fill="#FFD54F"/>
  <!-- 아래쪽 모래 (절반 차있음) -->
  <path d="M24 52 L24 46 Q32 40 40 46 L40 52 Z" fill="#FFD54F"/>
  <!-- 떨어지는 모래 줄기 -->
  <line x1="32" y1="28" x2="32" y2="40" stroke="#FFD54F" stroke-width="1.5"/>
</svg>`);

/** 벌써 - 시계 + 느낌표 */
export const ALREADY_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 시계 -->
  <circle cx="28" cy="32" r="20" fill="white" stroke="#424242" stroke-width="2"/>
  <circle cx="28" cy="32" r="1.5" fill="#424242"/>
  <!-- 시계 바늘 (빠르게 지나간 느낌) -->
  <line x1="28" y1="32" x2="28" y2="18" stroke="#424242" stroke-width="2" stroke-linecap="round"/>
  <line x1="28" y1="32" x2="38" y2="28" stroke="#E53935" stroke-width="1.5" stroke-linecap="round"/>
  <!-- 시계 눈금 -->
  <line x1="28" y1="14" x2="28" y2="16" stroke="#424242" stroke-width="1.5"/>
  <line x1="28" y1="48" x2="28" y2="50" stroke="#424242" stroke-width="1.5"/>
  <line x1="10" y1="32" x2="12" y2="32" stroke="#424242" stroke-width="1.5"/>
  <line x1="44" y1="32" x2="46" y2="32" stroke="#424242" stroke-width="1.5"/>
  <!-- 느낌표 (놀람) -->
  <rect x="52" y="10" width="5" height="18" rx="2.5" fill="#FF6F00"/>
  <circle cx="54.5" cy="34" r="2.5" fill="#FF6F00"/>
</svg>`);

/** 아마 - 물음표 + 생각하는 표정 */
export const MAYBE_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 얼굴 -->
  <circle cx="32" cy="36" r="20" fill="#FFE082"/>
  <!-- 눈 -->
  <circle cx="24" cy="34" r="2" fill="#5D4037"/>
  <circle cx="40" cy="34" r="2" fill="#5D4037"/>
  <!-- 눈썹 (올라간 형태) -->
  <path d="M21 30 Q24 27 27 30" fill="none" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M37 30 Q40 27 43 30" fill="none" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round"/>
  <!-- 입 (갸우뚱) -->
  <path d="M26 44 Q32 42 38 44" fill="none" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round"/>
  <!-- 물음표 구름 -->
  <ellipse cx="50" cy="14" rx="10" ry="10" fill="white" stroke="#BDBDBD" stroke-width="1"/>
  <text x="50" y="19" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="#FF6F00" text-anchor="middle">?</text>
</svg>`);

/** 정말 - 느낌표 두 개 (강조) */
export const REALLY_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 얼굴 -->
  <circle cx="32" cy="36" r="20" fill="#FFE082"/>
  <!-- 눈 (크게 뜬) -->
  <ellipse cx="24" cy="34" rx="3" ry="4" fill="white" stroke="#5D4037" stroke-width="1"/>
  <circle cx="24" cy="34" r="2" fill="#5D4037"/>
  <ellipse cx="40" cy="34" rx="3" ry="4" fill="white" stroke="#5D4037" stroke-width="1"/>
  <circle cx="40" cy="34" r="2" fill="#5D4037"/>
  <!-- 입 (놀란 O 모양) -->
  <ellipse cx="32" cy="46" rx="4" ry="3" fill="#5D4037"/>
  <!-- 느낌표 x2 -->
  <rect x="18" y="6" width="4" height="14" rx="2" fill="#E53935"/>
  <circle cx="20" cy="24" r="2" fill="#E53935"/>
  <rect x="42" y="6" width="4" height="14" rx="2" fill="#E53935"/>
  <circle cx="44" cy="24" r="2" fill="#E53935"/>
</svg>`);

/** 거의 - 거의 다 찬 원형 게이지 */
export const ALMOST_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 배경 원 -->
  <circle cx="32" cy="32" r="26" fill="#E0E0E0" stroke="#BDBDBD" stroke-width="1"/>
  <!-- 채워진 부분 (90%) -->
  <path d="M32 6 A26 26 0 1 1 6.5 24 L32 32 Z" fill="#4CAF50"/>
  <!-- 안쪽 흰 원 -->
  <circle cx="32" cy="32" r="16" fill="white"/>
  <!-- 퍼센트 숫자 -->
  <text x="32" y="37" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="#424242" text-anchor="middle">90%</text>
</svg>`);

/** 바로 - 번개/즉시 표시 */
export const RIGHTAWAY_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 번개 -->
  <polygon points="36,4 18,34 30,34 24,60 48,26 34,26 40,4" fill="#FFC107" stroke="#FF8F00" stroke-width="1.5" stroke-linejoin="round"/>
  <!-- 속도선 -->
  <line x1="6" y1="20" x2="16" y2="20" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/>
  <line x1="4" y1="32" x2="14" y2="32" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/>
  <line x1="6" y1="44" x2="16" y2="44" stroke="#FFD54F" stroke-width="2" stroke-linecap="round"/>
</svg>`);

/** 갑자기 - 폭발/번쩍 모양 */
export const SUDDENLY_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 폭발 모양 -->
  <polygon points="32,2 38,20 56,16 42,30 58,38 40,40 48,58 32,46 16,58 24,40 6,38 22,30 8,16 26,20" fill="#FFC107" stroke="#FF8F00" stroke-width="1.5"/>
  <!-- 중앙 느낌표 -->
  <rect x="29" y="18" width="6" height="18" rx="3" fill="#E53935"/>
  <circle cx="32" cy="42" r="3" fill="#E53935"/>
</svg>`);

/** 드디어 - 결승선/체크 깃발 + 별 -->  */
export const FINALLY_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 트로피 -->
  <path d="M22 20 L22 38 Q22 48 32 48 Q42 48 42 38 L42 20 Z" fill="#FFC107" stroke="#FF8F00" stroke-width="1.5"/>
  <!-- 트로피 손잡이 -->
  <path d="M22 24 Q12 24 12 32 Q12 38 22 38" fill="none" stroke="#FF8F00" stroke-width="2"/>
  <path d="M42 24 Q52 24 52 32 Q52 38 42 38" fill="none" stroke="#FF8F00" stroke-width="2"/>
  <!-- 받침대 -->
  <rect x="28" y="48" width="8" height="4" fill="#FF8F00"/>
  <rect x="24" y="52" width="16" height="4" rx="1" fill="#FF8F00"/>
  <!-- 별 -->
  <polygon points="32,10 34,16 40,16 35,20 37,26 32,22 27,26 29,20 24,16 30,16" fill="white"/>
</svg>`);

/** 그래서 - 원인 → 결과 화살표 */
export const SO_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 왼쪽 원 (원인) -->
  <circle cx="16" cy="32" r="12" fill="#E3F2FD" stroke="#1976D2" stroke-width="2"/>
  <text x="16" y="29" font-family="Arial,sans-serif" font-size="6" fill="#1976D2" text-anchor="middle">원인</text>
  <text x="16" y="37" font-family="Arial,sans-serif" font-size="5" fill="#1976D2" text-anchor="middle">cause</text>
  <!-- 화살표 -->
  <line x1="30" y1="32" x2="38" y2="32" stroke="#424242" stroke-width="3" stroke-linecap="round"/>
  <polygon points="38,26 48,32 38,38" fill="#424242"/>
  <!-- 오른쪽 원 (결과) -->
  <circle cx="56" cy="32" r="8" fill="#4CAF50" stroke="#2E7D32" stroke-width="2"/>
  <path d="M52 32 L55 35 L60 29" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>`);

/** 만약 - 갈림길/분기점 */
export const IF_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 시작점 -->
  <circle cx="14" cy="32" r="6" fill="#1976D2"/>
  <!-- 줄기 -->
  <line x1="20" y1="32" x2="32" y2="32" stroke="#424242" stroke-width="3" stroke-linecap="round"/>
  <!-- 분기 -->
  <line x1="32" y1="32" x2="52" y2="16" stroke="#4CAF50" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="32" y1="32" x2="52" y2="48" stroke="#E53935" stroke-width="2.5" stroke-linecap="round"/>
  <!-- 상단 결과 (O) -->
  <circle cx="56" cy="14" r="6" fill="#E8F5E9" stroke="#4CAF50" stroke-width="2"/>
  <text x="56" y="18" font-family="Arial,sans-serif" font-size="10" fill="#4CAF50" text-anchor="middle">O</text>
  <!-- 하단 결과 (X) -->
  <circle cx="56" cy="50" r="6" fill="#FFEBEE" stroke="#E53935" stroke-width="2"/>
  <text x="56" y="54" font-family="Arial,sans-serif" font-size="10" fill="#E53935" text-anchor="middle">X</text>
  <!-- 물음표 -->
  <text x="32" y="28" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#FF6F00" text-anchor="middle">?</text>
</svg>`);

/** ~도/또한 - 플러스 기호 */
export const ALSO_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 원형 배경 -->
  <circle cx="32" cy="32" r="26" fill="#E8F5E9"/>
  <!-- 플러스 기호 -->
  <rect x="27" y="14" width="10" height="36" rx="5" fill="#4CAF50"/>
  <rect x="14" y="27" width="36" height="10" rx="5" fill="#4CAF50"/>
</svg>`);

/** 대신 - 교환/스왑 화살표 */
export const INSTEAD_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 위쪽 화살표 (→) -->
  <line x1="12" y1="22" x2="44" y2="22" stroke="#1976D2" stroke-width="3" stroke-linecap="round"/>
  <polygon points="44,16 54,22 44,28" fill="#1976D2"/>
  <!-- 아래쪽 화살표 (←) -->
  <line x1="52" y1="42" x2="20" y2="42" stroke="#E53935" stroke-width="3" stroke-linecap="round"/>
  <polygon points="20,36 10,42 20,48" fill="#E53935"/>
  <!-- A 상자 -->
  <rect x="6" y="14" width="12" height="16" rx="2" fill="#BBDEFB" stroke="#1976D2" stroke-width="1"/>
  <text x="12" y="25" font-family="Arial,sans-serif" font-size="9" font-weight="bold" fill="#1976D2" text-anchor="middle">A</text>
  <!-- B 상자 -->
  <rect x="46" y="34" width="12" height="16" rx="2" fill="#FFCDD2" stroke="#E53935" stroke-width="1"/>
  <text x="52" y="45" font-family="Arial,sans-serif" font-size="9" font-weight="bold" fill="#E53935" text-anchor="middle">B</text>
</svg>`);

/** 꼭/반드시 - 강한 체크마크 + 느낌표 */
export const MUST_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 원형 배경 -->
  <circle cx="32" cy="32" r="26" fill="#FFEBEE" stroke="#E53935" stroke-width="2.5"/>
  <!-- 느낌표 -->
  <rect x="28" y="12" width="8" height="26" rx="4" fill="#E53935"/>
  <circle cx="32" cy="48" r="4" fill="#E53935"/>
</svg>`);

/** 선배 - 졸업 모자 쓴 사람 */
export const SENIOR_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 머리 -->
  <circle cx="32" cy="24" r="12" fill="#FFCC80"/>
  <!-- 눈 -->
  <circle cx="27" cy="23" r="1.5" fill="#5D4037"/>
  <circle cx="37" cy="23" r="1.5" fill="#5D4037"/>
  <!-- 미소 -->
  <path d="M27 28 Q32 33 37 28" fill="none" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round"/>
  <!-- 졸업모 -->
  <polygon points="32,6 10,16 32,22 54,16" fill="#424242"/>
  <rect x="30" y="6" width="4" height="10" fill="#424242"/>
  <line x1="54" y1="16" x2="54" y2="24" stroke="#FFC107" stroke-width="1.5"/>
  <circle cx="54" cy="25" r="2" fill="#FFC107"/>
  <!-- 몸 -->
  <path d="M20 38 Q20 56 32 56 Q44 56 44 38" fill="#42A5F5"/>
  <path d="M20 38 Q26 34 32 36 Q38 34 44 38" fill="#42A5F5"/>
</svg>`);

/** 가끔 - 달력에 드문드문 체크 표시 */
export const SOMETIMES_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 달력 -->
  <rect x="10" y="14" width="44" height="42" rx="3" fill="white" stroke="#424242" stroke-width="1.5"/>
  <rect x="10" y="14" width="44" height="10" rx="3" fill="#FF9800"/>
  <rect x="10" y="21" width="44" height="3" fill="#FF9800"/>
  <!-- 달력 고리 -->
  <rect x="20" y="10" width="3" height="8" rx="1" fill="#757575"/>
  <rect x="41" y="10" width="3" height="8" rx="1" fill="#757575"/>
  <!-- 날짜 그리드: 몇 개만 체크 (가끔) -->
  <circle cx="19" cy="31" r="3" fill="#E0E0E0"/>
  <path d="M26 29 L29 32 L33 27" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
  <circle cx="43" cy="31" r="3" fill="#E0E0E0"/>
  <circle cx="19" cy="40" r="3" fill="#E0E0E0"/>
  <circle cx="31" cy="40" r="3" fill="#E0E0E0"/>
  <circle cx="43" cy="40" r="3" fill="#E0E0E0"/>
  <path d="M16 47 L19 50 L23 45" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
  <circle cx="31" cy="49" r="3" fill="#E0E0E0"/>
  <path d="M40 47 L43 50 L47 45" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round"/>
</svg>`);

/** 편의점 - 한국식 편의점 외관 (CU/GS25 스타일) */
export const CONVENIENCE_STORE_SVG = svgToDataUri(`
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <!-- 건물 -->
  <rect x="6" y="20" width="52" height="38" rx="2" fill="#F5F5F5"/>
  <!-- 간판 -->
  <rect x="6" y="14" width="52" height="10" rx="2" fill="#1565C0"/>
  <rect x="10" y="16" width="44" height="6" rx="1" fill="#42A5F5"/>
  <text x="32" y="21.5" font-family="Arial,sans-serif" font-size="5" font-weight="bold" fill="white" text-anchor="middle">MART 24</text>
  <!-- 유리 자동문 -->
  <rect x="20" y="34" width="10" height="24" rx="1" fill="#BBDEFB" stroke="#90CAF9" stroke-width="0.5"/>
  <rect x="34" y="34" width="10" height="24" rx="1" fill="#BBDEFB" stroke="#90CAF9" stroke-width="0.5"/>
  <!-- 문 손잡이 -->
  <rect x="28" y="44" width="2" height="6" rx="1" fill="#9E9E9E"/>
  <rect x="34" y="44" width="2" height="6" rx="1" fill="#9E9E9E"/>
  <!-- 화살표 (자동문 표시) -->
  <path d="M26 47 L23 47" stroke="#1565C0" stroke-width="0.8" fill="none"/>
  <path d="M38 47 L41 47" stroke="#1565C0" stroke-width="0.8" fill="none"/>
  <!-- 왼쪽 유리창 -->
  <rect x="8" y="26" width="14" height="14" rx="1" fill="#E3F2FD" stroke="#90CAF9" stroke-width="0.5"/>
  <!-- 오른쪽 유리창 -->
  <rect x="42" y="26" width="14" height="14" rx="1" fill="#E3F2FD" stroke="#90CAF9" stroke-width="0.5"/>
  <!-- 진열대 (왼쪽 창) -->
  <rect x="9" y="33" width="12" height="1" fill="#BDBDBD"/>
  <rect x="10" y="30" width="3" height="3" rx="0.5" fill="#F44336"/>
  <rect x="14" y="30" width="3" height="3" rx="0.5" fill="#FF9800"/>
  <rect x="18" y="30" width="2" height="3" rx="0.5" fill="#4CAF50"/>
  <rect x="10" y="35" width="3" height="4" rx="0.5" fill="#2196F3"/>
  <rect x="14" y="35" width="3" height="4" rx="0.5" fill="#FFC107"/>
  <!-- 진열대 (오른쪽 창) -->
  <rect x="43" y="33" width="12" height="1" fill="#BDBDBD"/>
  <rect x="44" y="30" width="3" height="3" rx="0.5" fill="#9C27B0"/>
  <rect x="48" y="30" width="3" height="3" rx="0.5" fill="#E91E63"/>
  <rect x="52" y="30" width="2" height="3" rx="0.5" fill="#00BCD4"/>
  <!-- 24시 표시 -->
  <circle cx="52" cy="22" r="3" fill="#FF6F00"/>
  <text x="52" y="23.5" font-family="Arial,sans-serif" font-size="3.5" font-weight="bold" fill="white" text-anchor="middle">24</text>
  <!-- 지붕 조명 -->
  <rect x="6" y="12" width="52" height="3" fill="#0D47A1"/>
</svg>`);
