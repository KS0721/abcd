// ========================================
// llm.ts - 로컬 LLM 클라이언트 (OpenAI-compatible API)
//
// Ollama, llama.cpp, LM Studio, vLLM 등 로컬 LLM 서버와 호환
// API 키 불필요 — 로컬 서버에 직접 연결
//
// 논문 근거:
//   - Valencia et al. (2023, CHI): LLM → AAC 소통 속도/다양성 2배 향상
//   - Cai et al. (2024, Nature): LLM + STT → ALS 환자 소통 57% 효율 증가
//
// 핵심 원칙 (AI_INTEGRATION_NOTES.md):
//   - 0 추가 터치: AI는 백그라운드에서 작동
//   - 폴백 보장: LLM 실패 시 기존 규칙 기반 동작 100% 유지
//   - 지연시간 최소화: 500ms 이내
// ========================================

// === 설정 ===

interface LLMConfig {
  baseUrl: string;    // 로컬 LLM 서버 URL (예: http://localhost:11434)
  model: string;      // 모델 이름 (예: gemma3:4b)
  timeout: number;    // 요청 타임아웃 (ms)
  enabled: boolean;   // LLM 기능 활성화 여부
}

const DEFAULT_CONFIG: LLMConfig = {
  baseUrl: import.meta.env.VITE_LLM_URL || 'http://localhost:11434',
  model: import.meta.env.VITE_LLM_MODEL || 'gemma3:4b',
  timeout: Number(import.meta.env.VITE_LLM_TIMEOUT) || 3000,
  enabled: import.meta.env.VITE_LLM_ENABLED === 'true',
};

let config: LLMConfig = { ...DEFAULT_CONFIG };

/** LLM 설정 업데이트 (런타임에서 변경 가능) */
export function configureLLM(updates: Partial<LLMConfig>): void {
  config = { ...config, ...updates };
}

/** 현재 LLM 설정 가져오기 */
export function getLLMConfig(): Readonly<LLMConfig> {
  return config;
}

/** LLM이 사용 가능한 상태인지 확인 */
export function isLLMAvailable(): boolean {
  return config.enabled && !!config.baseUrl;
}

// === 응답 캐시 (동일 입력 재사용) ===

const cache = new Map<string, { result: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5분

function getCacheKey(system: string, user: string): string {
  return `${system.slice(0, 50)}::${user.slice(0, 200)}`;
}

// === 핵심 요청 함수 ===

interface CompletionOptions {
  system: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * LLM에 요청 보내기 (OpenAI-compatible /v1/chat/completions)
 *
 * Ollama: http://localhost:11434/v1/chat/completions
 * llama.cpp: http://localhost:8080/v1/chat/completions
 * LM Studio: http://localhost:1234/v1/chat/completions
 */
export async function complete(options: CompletionOptions): Promise<string | null> {
  if (!isLLMAvailable()) return null;

  const { system, prompt, maxTokens = 200, temperature = 0.3 } = options;

  // 캐시 확인
  const cacheKey = getCacheKey(system, prompt);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    clearTimeout(timer);

    if (!response.ok) return null;

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || null;

    // 캐시 저장
    if (text) {
      cache.set(cacheKey, { result: text, timestamp: Date.now() });
      // 캐시 크기 제한 (최대 50개)
      if (cache.size > 50) {
        const oldest = cache.keys().next().value;
        if (oldest) cache.delete(oldest);
      }
    }

    return text;
  } catch {
    // 네트워크 에러, 타임아웃 등 → null 반환 (폴백으로)
    return null;
  }
}

/**
 * LLM 응답에서 JSON 추출 (마크다운 코드블록 처리)
 */
export function parseJSON<T>(text: string | null): T | null {
  if (!text) return null;
  try {
    // ```json ... ``` 블록 추출
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * LLM 서버 연결 테스트
 */
export async function testConnection(): Promise<boolean> {
  if (!config.baseUrl) return false;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${config.baseUrl}/v1/models`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}
