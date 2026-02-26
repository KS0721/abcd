// ========================================
// ttsEngine.ts - Supertonic TTS 2 엔진 관리
//
// HYBE 자회사 Supertone의 오픈소스 TTS 모델 (66M params)
// ONNX Runtime Web으로 브라우저에서 직접 실행
// 한국어 네이티브 지원 (ko 태그)
//
// 동작 방식:
//   1. 앱 시작 → initSupertonic() 호출 (백그라운드)
//   2. @huggingface/transformers가 ONNX 모델 다운로드 (~305MB)
//   3. 브라우저 Cache API에 자동 캐싱 (이후 재다운로드 불필요)
//   4. 다운로드 완료 후 isSupertonicReady() === true
//   5. supertonicSynthesize()로 텍스트 → Float32Array 오디오 변환
//
// 논문 근거:
//   - Cai et al. (2024, Nature Communications): 로컬 AI 모델이
//     클라우드 대비 응답 지연 70% 감소 → AAC 실시간성 확보
//   - Beukelman & Mirenda (2013): 오프라인 TTS는 AAC 시스템의
//     가용성(availability) 핵심 요소 → 인터넷 없이도 의사소통 가능
//
// AI TODO [LLM + TTS 통합 확장]:
//   향후 LLM 서버 확보 시 Edge TTS 프록시를 같은 서버에 배포하여
//   3단계 폴백으로 확장 가능:
//   Tier 0: Edge TTS (서버 경유, 최고 품질, 9개 한국어 음성)
//   Tier 1: Supertonic TTS 2 (로컬, 고품질, 오프라인)
//   Tier 2: Web Speech API (내장, 항상 사용 가능)
// ========================================

const MODEL_ID = 'onnx-community/Supertonic-TTS-2-ONNX';
const VOICE_URL = `https://huggingface.co/${MODEL_ID}/resolve/main/voices/F1.bin`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TTSPipeline = any;

let ttsPipeline: TTSPipeline | null = null;
let isLoading = false;
let downloadProgress = 0;

/** Supertonic TTS 2 모델이 로드 완료되었는지 */
export function isSupertonicReady(): boolean {
  return ttsPipeline !== null;
}

/** 현재 다운로드 진행률 (0-100) */
export function getSupertonicProgress(): number {
  return downloadProgress;
}

/** 모델 다운로드/로딩 중인지 */
export function isSupertonicLoading(): boolean {
  return isLoading;
}

/**
 * Supertonic TTS 2 모델 백그라운드 초기화
 * - 중복 호출 안전 (이미 로드/로딩 중이면 무시)
 * - ~305MB 모델을 다운로드하여 브라우저 캐시에 저장
 * - 이후 실행 시 캐시에서 즉시 로드
 */
export async function initSupertonic(
  onProgress?: (progress: number) => void,
): Promise<boolean> {
  if (ttsPipeline) return true;
  if (isLoading) return false;

  isLoading = true;
  downloadProgress = 0;

  try {
    // Dynamic import: Vite가 자동으로 코드 스플릿 (메인 번들에 포함 안 됨)
    const { pipeline, env } = await import('@huggingface/transformers');

    // 브라우저 캐시 사용 (Cache API / OPFS)
    env.allowLocalModels = false;
    env.useBrowserCache = true;

    ttsPipeline = await pipeline('text-to-speech', MODEL_ID, {
      // 다운로드 진행률 콜백
      progress_callback: (info: { progress?: number; status?: string }) => {
        if (typeof info.progress === 'number') {
          downloadProgress = Math.round(info.progress);
          onProgress?.(downloadProgress);
        }
      },
    });

    downloadProgress = 100;
    isLoading = false;
    console.log('[Supertonic TTS] 로드 완료 — 고품질 한국어 TTS 사용 가능');
    return true;
  } catch (e) {
    console.warn('[Supertonic TTS] 로드 실패 (Web Speech API 폴백 사용):', e);
    ttsPipeline = null;
    isLoading = false;
    return false;
  }
}

/**
 * Supertonic으로 텍스트 → 오디오 합성
 * @param text 한국어 텍스트
 * @param speed 발화 속도 (기본 1.0)
 * @returns Float32Array 오디오 + 샘플레이트, 실패 시 null
 */
export async function supertonicSynthesize(
  text: string,
  speed = 1.0,
): Promise<{ audio: Float32Array; sampleRate: number } | null> {
  if (!ttsPipeline) return null;

  try {
    // 한국어 태그로 감싸서 전달
    const result = await ttsPipeline(`<ko>${text}</ko>`, {
      speaker_embeddings: VOICE_URL,
      num_inference_steps: 5,
      speed,
    });

    return {
      audio: result.audio as Float32Array,
      sampleRate: (result.sampling_rate as number) || 24000,
    };
  } catch (e) {
    console.warn('[Supertonic TTS] 합성 실패:', e);
    return null;
  }
}
