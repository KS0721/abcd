// ========================================
// useSwipeGesture.ts - 슬라이드 스와이프 제스처
// 카드 그리드 영역에서만 스와이프 허용
// (긴급바, 카테고리바 터치 시 페이지 넘김 방지)
// ========================================

import { useRef, useCallback } from 'react';
import type { SlideIndex } from '../../shared/types.ts';
import { useUIStore } from '../store/useUIStore.ts';

// ── 스와이프 감지 임계값 (px) ──
// 50px → 80px로 상향 조정
// 수정 이유: 50px은 운동장애 사용자가 카드를 누르려다 손가락이 살짝 미끄러지면
//   의도치 않게 카테고리가 바뀌는 문제 발생 (카드 선택 실패 + 혼란)
// 논문: Trewin & Pain (1999) — 운동장애 사용자의 터치 오류율이 비장애 사용자보다 높음
// 논문: Thistle & Wilkinson (2017) — 의도치 않은 조작이 AAC 사용 포기의 원인
//
// ────────────────────────────────────────────────────────────
// [LLM 확장 계획 — 교수님께 설명용]
// ────────────────────────────────────────────────────────────
//
// ■ 현재 상태:
//   스와이프 감지 최소 거리가 80px로 고정되어 있습니다.
//   이 값보다 짧게 밀면 스와이프로 인식하지 않고, 길게 밀면 카테고리가 바뀝니다.
//
// ■ 문제점:
//   사용자의 손 크기, 운동 능력, 기기 크기에 따라 자연스러운 스와이프 거리가 다릅니다.
//   - 손이 작거나 세밀한 제어가 가능한 사용자: 60px이면 충분
//   - 손 떨림이 있는 사용자: 80px도 부족, 100px 이상이 필요할 수 있음
//   - 태블릿 vs 스마트폰: 화면 크기에 따라 자연스러운 스와이프 거리가 다름
//
// ■ LLM을 사용하면 해결되는 이유:
//   LLM이 사용자의 터치 이동 데이터를 분석하여 "의도적 스와이프"와
//   "실수로 미끄러진 터치"를 구분하는 최적 임계값을 자동으로 찾습니다.
//
//   구체적 작동 방식:
//   1. 터치 이벤트에서 이동 거리(px)와 그 결과(카테고리 변경됨/안됨)를 수집
//      예: [{dx: 85, intended: true}, {dx: 45, intended: false}, ...]
//   2. 이 데이터를 LLM에게 전달합니다:
//      "다음은 AAC 사용자의 터치 이동 데이터입니다.
//       dx는 수평 이동 거리(px), intended는 사용자가 카테고리 변경을 원했는지 여부입니다.
//       의도적 스와이프와 실수를 가장 잘 구분하는 최적 임계값(px)을 추천해주세요."
//   3. LLM이 분석 결과를 반환합니다:
//      "의도적 스와이프의 최소 거리는 평균 92px, 실수 터치의 최대 거리는 평균 55px입니다.
//       최적 임계값은 73px입니다."
//   4. 앱이 자동으로 적용합니다 (사용자는 아무것도 할 필요 없음)
//
// ■ 왜 단순 통계가 아닌 LLM인가:
//   - 시간대별 피로도 반영 (오후에 손 떨림 증가 → 임계값 자동 상향)
//   - 기기 방향 고려 (세로/가로에 따라 자연스러운 스와이프 거리 다름)
//   - 최근 사용 패턴 변화 감지 (질환 진행으로 운동 능력 변화 시 자동 적응)
//
// ■ 논문 근거:
//   - Cai et al. (2024, Nature Communications): LLM 기반 입력 개인화 → 57% 효율 향상
//   - Fager et al. (2019): 운동장애 사용자 접근 기술은 개별화가 핵심
//   - Mandak et al. (2019): 다중 접근 방식의 유연한 전환이 사용성 향상
//
// ■ 구현 시 필요한 것:
//   - 로컬 LLM 서버 (llm.ts에 이미 클라이언트 준비됨)
//   - 터치 이동 데이터 수집 (dx, dy, duration 등)
//   - LLM 프롬프트: "다음은 AAC 사용자의 최근 50회 터치 이동 데이터입니다: [...]
//     의도적 스와이프와 실수 터치를 구분하는 최적 임계값(px)을 추천해주세요."
// ────────────────────────────────────────────────────────────
const SWIPE_THRESHOLD = 80; // px (50→80 상향)
const MAX_SLIDES = 5; // 실제 카테고리 탭 5개에 맞춤 (기존 4 → 5 수정)

/** 터치 시작 지점이 스와이프 금지 영역인지 확인 */
function isNoSwipeZone(target: EventTarget | null): boolean {
  let el = target as HTMLElement | null;
  while (el) {
    if (el.dataset?.noSwipe !== undefined) return true;
    el = el.parentElement;
  }
  return false;
}

export function useSwipeGesture() {
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // 긴급바, 카테고리바 등에서 시작된 터치는 스와이프 무시
    if (isNoSwipeZone(e.target)) {
      touchStart.current = null;
      return;
    }

    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const dt = Date.now() - touchStart.current.time;
    touchStart.current = null;

    // 수직 스와이프 무시, 너무 느린 스와이프 무시
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dt > 500) return;

    const { currentSlide, setCurrentSlide } = useUIStore.getState();

    if (dx < 0 && currentSlide < MAX_SLIDES - 1) {
      setCurrentSlide((currentSlide + 1) as SlideIndex);
    } else if (dx > 0 && currentSlide > 0) {
      setCurrentSlide((currentSlide - 1) as SlideIndex);
    }
  }, []);

  return { handleTouchStart, handleTouchEnd };
}
