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

// 리소스 재사용: AudioContext와 MediaStream을 한 번만 생성하여 반복 사용
// 수정 전: 10초마다 new AudioContext() + getUserMedia() 생성 → 리소스 누적/성능 저하
// 수정 후: 한 번 생성 후 재사용, 앱 성능 안정성 확보
// 논문: Fager et al. (2019) - 환경 적응형 AAC 출력이 안정적으로 동작해야 함
let sharedStream: MediaStream | null = null;
let sharedCtx: AudioContext | null = null;
let sharedAnalyser: AnalyserNode | null = null;

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

/** 마이크로 주변 소음 측정 (300ms 샘플) — 리소스 재사용 */
async function measureNoise(): Promise<number> {
  // 기존 리소스가 없거나 스트림이 종료된 경우에만 새로 생성
  if (!sharedStream || !sharedStream.active) {
    sharedStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    sharedCtx = new AudioContext();
    const source = sharedCtx.createMediaStreamSource(sharedStream);
    sharedAnalyser = sharedCtx.createAnalyser();
    sharedAnalyser.fftSize = 256;
    source.connect(sharedAnalyser);
  }

  if (!sharedAnalyser) return cachedVolume;

  // 300ms 대기 후 안정적 데이터 수집
  await new Promise((r) => setTimeout(r, 300));

  const data = new Uint8Array(sharedAnalyser.frequencyBinCount);
  sharedAnalyser.getByteFrequencyData(data);
  const avg = data.reduce((a, b) => a + b, 0) / data.length;

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
