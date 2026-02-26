import { useCallback, useRef } from 'react';
import { useScanningStore } from '../../store/useScanningStore';
import { useScanning } from '../../hooks/useScanning';
import styles from '../../styles/Scanning.module.css';

// ── 더블 탭 감지 시간 (ms) ──
// 400ms → 500ms로 상향 조정
// 수정 이유: 400ms는 일반 사용자에게는 괜찮지만, 운동장애 사용자에게는
//   짧은 터치와 더블탭을 구분하기 어려움 (의도치 않은 화면 이동 유발)
// 논문: Hajjar et al. (2016) — 뇌성마비 아동의 스위치 타이밍이 극히 어려움, 개별화 필수
// 논문: Trewin & Pain (1999) — 운동장애 사용자의 터치 간격이 비장애 사용자보다 넓음
//
// ────────────────────────────────────────────────────────────
// [LLM 확장 계획 — 교수님께 설명용]
// ────────────────────────────────────────────────────────────
//
// ■ 현재 상태:
//   더블탭 감지 시간이 500ms로 고정되어 있습니다.
//   모든 사용자가 동일한 값을 사용합니다.
//
// ■ 문제점:
//   운동 능력은 사용자마다 크게 다릅니다.
//   - 경증 사용자: 300ms면 충분 → 500ms는 반응이 느리다고 느낌
//   - 중증 사용자: 500ms도 부족 → 800ms 이상이 필요할 수 있음
//   고정값 하나로는 모든 사용자를 만족시킬 수 없습니다.
//
// ■ LLM을 사용하면 해결되는 이유:
//   LLM이 사용자의 터치 패턴 데이터를 분석하여 "이 사용자에게 최적인
//   더블탭 감지 시간"을 자동으로 계산할 수 있습니다.
//
//   구체적 작동 방식:
//   1. 사용자가 앱을 사용할 때마다 터치 간격(ms)을 수집합니다
//      예: [450ms, 520ms, 380ms, 600ms, 410ms, ...]
//   2. 이 데이터를 LLM에게 전달합니다:
//      "이 사용자의 터치 간격 데이터를 분석해서 최적의 더블탭 감지 시간을 추천해줘"
//   3. LLM이 분석 결과를 반환합니다:
//      "이 사용자의 평균 터치 간격은 470ms이고 표준편차는 80ms입니다.
//       95% 신뢰구간을 고려하면 최적 더블탭 시간은 630ms입니다."
//   4. 앱이 이 값을 자동으로 적용합니다 (사용자는 아무것도 할 필요 없음)
//
// ■ 왜 단순 통계가 아닌 LLM인가:
//   단순 평균/표준편차만으로도 기본적인 조절은 가능하지만, LLM은 추가로:
//   - 시간대별 변화 (아침에는 손이 뻣뻣 → 더 넓은 간격 필요)
//   - 피로도 패턴 (사용 30분 후 정확도 하락 → 자동 간격 확대)
//   - 질환별 특성 (파킨슨 vs 뇌성마비 vs ALS의 운동 패턴 차이)
//   을 종합적으로 이해하여 더 정밀한 추천이 가능합니다.
//
// ■ 논문 근거:
//   - Cai et al. (2024, Nature Communications): LLM으로 ALS 환자 입력 57% 효율화
//   - Valencia et al. (2023, CHI): 개인화된 AI 지원 → AAC 소통 속도 2배
//   - Hajjar et al. (2016): 스위치 접근 시 개별화된 타이밍 설정 필수
//
// ■ 구현 시 필요한 것:
//   - 로컬 LLM 서버 (Ollama + gemma3:4b 등, llm.ts에 이미 클라이언트 준비됨)
//   - 터치 간격 데이터 수집 로직 (usageStats.ts 확장)
//   - LLM 프롬프트: "다음은 AAC 사용자의 최근 100회 터치 간격 데이터입니다: [...]
//     이 사용자에게 최적인 더블탭 감지 시간(ms)을 추천해주세요."
// ────────────────────────────────────────────────────────────
const DOUBLE_TAP_DELAY = 500; // ms (400→500 상향)
const LONG_PRESS_DELAY = 1500; // ms

/**
 * 전체화면 터치 오버레이
 * - 짧은 터치 = 선택
 * - 꾹 누르기 (1.5초) = 스캐닝 끄기
 * - 두번터치 (500ms 이내) = 화면 이동
 */
export default function ScanningOverlay() {
  const isActive = useScanningStore((s) => s.isActive);
  const { selectCurrent, stop, navigateScreen } = useScanning();

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const lastTapTime = useRef(0);


  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    didLongPress.current = false;

    // 꾹 누르기 → 스캐닝 끄기
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      stop();
    }, LONG_PRESS_DELAY);
  }, [stop]);

  const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 롱프레스 타이머 해제
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (didLongPress.current) return; // 이미 롱프레스 처리됨

    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime.current;

    if (timeSinceLastTap < DOUBLE_TAP_DELAY && singleTapTimer.current) {
      // 두번터치 감지 → 화면 이동
      clearTimeout(singleTapTimer.current);
      singleTapTimer.current = null;
      lastTapTime.current = 0;
      if (navigator.vibrate) navigator.vibrate([30, 30, 30]);
      navigateScreen();
    } else {
      // 첫 번째 탭 → 지연 후 단일 터치로 처리
      lastTapTime.current = now;
      singleTapTimer.current = setTimeout(() => {
        singleTapTimer.current = null;
        if (navigator.vibrate) navigator.vibrate(30);
        selectCurrent();
      }, DOUBLE_TAP_DELAY);
    }
  }, [selectCurrent, navigateScreen]);

  if (!isActive) return null;

  return (
    <>
      {/* 전체화면 터치 영역 */}
      <div
        className={styles.touchZone}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      />

      {/* 하단 힌트 */}
      <div className={styles.overlay}>
        <div className={styles.touchHint}>
          터치 = 선택 · 꾹 = 끄기 · 두번터치 = 화면이동
        </div>
      </div>
    </>
  );
}
