// ========================================
// adaptiveVolume.ts - 주변 소음 기반 적응형 음량
//
// Web Audio API로 마이크 입력을 분석하여
// 주변 소음이 크면 TTS 음량을 높이고, 조용하면 낮춤
// 논문: Fager et al. (2019) - 환경 적응형 AAC 출력
// ========================================

let cachedVolume = 0.7;
let lastMeasured = 0;
let measuring = false;

/**
 * 현재 적응형 음량 값 반환 (동기)
 * 내부적으로 10초마다 비동기 측정을 트리거
 */
export function getAdaptiveVolume(): number {
  const now = Date.now();
  if (!measuring && now - lastMeasured > 10000) {
    measuring = true;
    measureNoise()
      .then((v) => {
        cachedVolume = v;
        lastMeasured = Date.now();
      })
      .finally(() => {
        measuring = false;
      });
  }
  return cachedVolume;
}

/** 마이크로 주변 소음 측정 (300ms 샘플) */
async function measureNoise(): Promise<number> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const ctx = new AudioContext();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);

  // 300ms 대기 후 안정적 데이터 수집
  await new Promise((r) => setTimeout(r, 300));

  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  const avg = data.reduce((a, b) => a + b, 0) / data.length;

  // 리소스 정리
  stream.getTracks().forEach((t) => t.stop());
  await ctx.close();

  // 소음 레벨 → 음량 매핑: 조용(0) → 0.4, 시끄러움(80+) → 1.0
  return Math.min(1.0, Math.max(0.4, 0.4 + (avg / 80) * 0.6));
}

/**
 * 마이크 권한 사전 요청 (설정에서 '자동' 선택 시 호출)
 * 권한이 거부되면 false 반환
 */
export async function requestMicPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    // 즉시 첫 측정 트리거
    lastMeasured = 0;
    getAdaptiveVolume();
    return true;
  } catch {
    return false;
  }
}
