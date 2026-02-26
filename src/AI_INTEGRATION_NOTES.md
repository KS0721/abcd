# 올인원 AAC - AI/LLM 통합 아키텍처 문서

> 이 문서는 올인원 AAC 앱에 LLM(대형 언어 모델)을 통합할 때 참고할 종합 설계서입니다.
> 각 통합 지점의 역할, 입력/출력, LLM 프롬프트 예시, 논문 근거를 포함합니다.

---

## 목차
1. [통합 개요](#1-통합-개요)
2. [AI 통합 지점 #1: 스마트 카드 추천 (SuggestionBar)](#2-ai-통합-지점-1-스마트-카드-추천)
3. [AI 통합 지점 #2: 개인화 문장 생성 (QuickPhrasesScreen)](#3-ai-통합-지점-2-개인화-문장-생성)
4. [AI 통합 지점 #3: 대화 흐름 총괄 제어 (SpeakScreen)](#4-ai-통합-지점-3-대화-흐름-총괄-제어)
5. [AI 통합 지점 #4: 상황 자동 감지 (SituationScreen)](#5-ai-통합-지점-4-상황-자동-감지)
6. [AI 통합 지점 #5: 문장 교정 + STT (OutputBar)](#6-ai-통합-지점-5-문장-교정--stt)
7. [AI 통합 지점 #6: 스마트 카드 정렬 (CardGrid)](#7-ai-통합-지점-6-스마트-카드-정렬)
8. [AI 통합 지점 #7: 한국어 자동 문법 (grammar.ts)](#8-ai-통합-지점-7-한국어-자동-문법)
9. [AI 통합 지점 #8: 기록 분석 + 패턴 학습 (HistoryScreen)](#9-ai-통합-지점-8-기록-분석--패턴-학습)
10. [인프라 아키텍처](#10-인프라-아키텍처)
11. [논문 참고 목록](#11-논문-참고-목록)

---

## 1. 통합 개요

### 1.1 목표
말을 못하는 사용자가 **최소한의 터치**로 **자연스러운 한국어 문장**을 발화할 수 있도록
LLM이 문맥을 이해하고 다음 행동을 예측/추천하는 것

### 1.2 핵심 원칙
- **0 추가 터치**: AI는 사용자의 추가 조작 없이 백그라운드에서 작동
- **폴백 보장**: AI 실패 시 기존 규칙 기반 동작 100% 유지
- **개인정보 보호**: 사용자 개인정보 수집 없음, 모든 데이터 로컬 처리 우선
- **지연시간 최소화**: 사용자 체감 500ms 이내 응답

### 1.3 LLM 모델 요구사항
- **한국어 능력**: 한국어 존댓말/반말 구분, 조사 처리, 높임말 변환
- **응답 속도**: 추론 500ms 이내 (스트리밍 지원 시 첫 토큰 200ms 이내)
- **컨텍스트 윈도우**: 최소 4K 토큰 (대화 이력 + 카드 목록 포함)
- **출력 포맷**: JSON 형식 구조화 출력 안정적 지원

### 1.4 통합 우선순위
| 순위 | 통합 지점 | 효과 | 난이도 | 파일 |
|------|----------|------|--------|------|
| 1 | 스마트 카드 추천 | ★★★★★ | 중간 | SuggestionBar.tsx |
| 2 | 한국어 자동 문법 | ★★★★★ | 높음 | grammar.ts |
| 3 | 개인화 문장 생성 | ★★★★☆ | 중간 | QuickPhrasesScreen.tsx |
| 4 | 기록 분석 + 패턴 | ★★★★☆ | 낮음 | HistoryScreen.tsx |
| 5 | 문장 교정 | ★★★☆☆ | 낮음 | OutputBar.tsx |
| 6 | STT 대화 문맥 | ★★★★★ | 높음 | OutputBar.tsx |
| 7 | 상황 자동 감지 | ★★★☆☆ | 중간 | SituationScreen.tsx |
| 8 | 카드 정렬 최적화 | ★★☆☆☆ | 낮음 | CardGrid.tsx |

---

## 2. AI 통합 지점 #1: 스마트 카드 추천

### 파일: `src/components/cards/SuggestionBar.tsx`

### 현재 동작
정적 매핑 (`verbSuggestions.ts`)에서 동사 → 관련 명사 추천

### AI 동작
사용자가 카드를 선택할 때마다, 선택된 카드 + 대화 문맥 + 시간대를 분석하여
다음에 선택할 가능성이 높은 카드 5~8개를 실시간 추천

### 입력
```typescript
interface SuggestionInput {
  selectedCards: Card[];           // 현재 선택된 카드 배열
  currentCategory: CategoryId;     // 현재 카테고리
  history: string[];               // 최근 발화 기록 (최근 20개)
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  activeSituation?: SituationId;   // 활성 상황판
  allCards: Record<CategoryId, Card[]>;  // 전체 카드 목록
}
```

### 출력
```typescript
interface SuggestionOutput {
  cardIds: string[];    // 추천 카드 ID (최대 8개, 확률순)
}
```

### LLM 프롬프트
```
[시스템]
당신은 AAC(보완대체의사소통) 앱의 카드 추천 AI입니다.
말을 못하는 사용자가 카드를 눌러 의사소통합니다.
사용자의 현재 문맥을 분석하여 다음에 누를 카드를 예측하세요.

[현재 상태]
선택된 카드: {selectedCards.map(c => c.text).join(', ')}
현재 시간: {timeOfDay}
최근 발화: {history.slice(0, 5).join(' / ')}

[사용 가능한 카드]
{allCards를 카테고리별로 나열}

[규칙]
1. 문법적으로 자연스러운 문장이 되는 카드를 우선
2. 사용자의 과거 패턴을 반영
3. 시간대에 맞는 카드 우선 (아침→음식, 저녁→집)
4. 카드 ID만 JSON 배열로 반환

[응답 형식]
{"cardIds": ["a_go", "fo_rice", "pl_school", ...]}
```

### 구현 계획
```typescript
// src/lib/ai.ts에 추가
export async function getSmartSuggestions(input: SuggestionInput): Promise<string[]> {
  try {
    const response = await llm.complete({
      systemPrompt: SUGGESTION_SYSTEM_PROMPT,
      userPrompt: formatSuggestionPrompt(input),
      maxTokens: 200,
      temperature: 0.3,  // 낮은 온도로 안정적 추천
    });
    const parsed = JSON.parse(response.text);
    return parsed.cardIds;
  } catch {
    // 폴백: 기존 정적 매핑 사용
    return getStaticSuggestions(input.selectedCards);
  }
}
```

### 성능 목표
- Top-5 적중률: 60% 이상
- 응답 지연: 500ms 이내
- 카드 선택 횟수 감소: 30%

### 논문 근거
- Trnka et al. (2009, NAACL): N-gram 기반 AAC 단어 예측 → 입력 40% 감소
- Valencia et al. (2023, CHI): LLM 추천이 AAC 대화 속도를 크게 향상

---

## 3. AI 통합 지점 #2: 개인화 문장 생성

### 파일: `src/components/screens/QuickPhrasesScreen.tsx`

### 현재 동작
사용자가 수동 등록한 문장 목록 (터치 → TTS)

### AI 동작
시간대, 대화 문맥, 과거 패턴을 분석하여 "지금 말할 가능성이 높은 완성 문장" 3~5개 자동 생성
→ 카드 조합 없이 한 번 터치로 복잡한 문장 즉시 발화

### 입력
```typescript
interface PhraseGenerationInput {
  history: string[];               // 최근 100개 발화
  quickPhrases: string[];          // 사용자 등록 빠른 문장
  timeOfDay: string;               // 시간대
  dayOfWeek: string;               // 요일
  recentContext: string[];          // 최근 5분간 발화
}
```

### 출력
```typescript
interface PhraseGenerationOutput {
  phrases: Array<{
    text: string;        // 추천 문장
    reason: string;      // 추천 이유
    confidence: number;  // 신뢰도 (0~1)
  }>;
}
```

### LLM 프롬프트
```
당신은 AAC 앱의 문장 추천 AI입니다.
말을 못하는 사용자가 빠르게 의사소통할 수 있도록 완성 문장을 추천합니다.

사용자 정보:
- 현재 시간: {date} {time} ({dayOfWeek})
- 최근 발화: {recentContext}
- 발화 패턴:
  아침(7-9시): {morningPatterns}
  점심(11-13시): {lunchPatterns}
  저녁(17-19시): {dinnerPatterns}

규칙:
1. 한국어 존댓말(~요 체) 사용
2. 짧고 실용적 (15자 이내 권장)
3. 사용자 기존 패턴 우선 반영
4. 5개 문장 추천, 각각 이유 한 줄 설명

JSON 응답:
[{"text": "학교 가요", "reason": "월요일 아침 자주 사용", "confidence": 0.92}, ...]
```

### 논문 근거
- Trnka & McCoy (2008, ACL): 개인화 언어 모델 적응
- Shen et al. (2022, ASSETS): 대형 언어모델 기반 AAC 문장 예측
- Cai et al. (2024, Nature Communications): 개인화 LLM → 입력 효율 57% 증가

---

## 4. AI 통합 지점 #3: 대화 흐름 총괄 제어

### 파일: `src/components/screens/SpeakScreen.tsx`

### AI 동작
말하기 화면의 전체 AI 허브 역할. 대화 세션을 관리하고
하위 컴포넌트(SuggestionBar, CardGrid, CategoryBar)에 AI 결과를 분배

### 대화 세션 관리
```typescript
interface ConversationSession {
  startTime: Date;
  turns: Array<{
    userSaid: string;       // 사용자 TTS 발화
    partnerSaid?: string;   // 상대방 STT 인식 (옵션)
    timestamp: Date;
  }>;
  currentTopic?: string;    // LLM이 파악한 대화 주제
  suggestedCategory?: CategoryId;  // 추천 카테고리
}
```

### LLM 프롬프트 (세션 관리)
```
[시스템] 당신은 AAC 앱의 대화 보조 AI입니다.

[대화 기록]
사용자: "안녕하세요" (카드 발화)
상대방: "안녕! 오늘 뭐 했어?" (STT 인식)
사용자: (카드 선택 중... 현재 선택: ["학교"])

[요청] JSON으로 응답:
{
  "suggestedCards": ["a_study", "a_play", "fo_rice"],
  "suggestedCategory": "action",
  "conversationTopic": "일상"
}
```

### 논문 근거
- Light & McNaughton (2014): AAC 의사소통 역량 향상 설계 원칙
- Higginbotham et al. (2007): 대화 문맥이 AAC 발화 속도에 미치는 영향
- Valencia et al. (2023, CHI): LLM + 대화 문맥 → 소통 속도/다양성 2배

---

## 5. AI 통합 지점 #4: 상황 자동 감지

### 파일: `src/components/screens/SituationScreen.tsx`

### AI 동작
시간, 대화 문맥, GPS(선택)를 종합하여 현재 상황을 자동 감지
→ 20개 상황판 중 적합한 것을 자동 추천 or 동적 상황판 생성

### LLM 프롬프트
```
AAC 앱의 상황 감지 AI입니다.

현재 정보:
- 시간: {datetime}
- 최근 발화: {recentHistory}
- 상대방 발화(STT): {sttContext}

상황판 목록: home, hospital, restaurant, school, daycare, car, park,
  mart, bath, cafe, dental, hairsalon, exercise, travel, cinema,
  library, pool, pharmacy, workplace, play

JSON 응답:
{"situationId": "school", "confidence": 0.95, "reason": "수업 관련 대화 중"}
```

### 논문 근거
- Beukelman & Light (2020): 상황 기반 AAC 어휘 조직 가이드라인
- Schlosser & Koul (2015): 상황별 어휘 선택의 의사소통 성공률 영향

---

## 6. AI 통합 지점 #5: 문장 교정 + STT

### 파일: `src/components/layout/OutputBar.tsx`

### AI 동작 1: 문장 자동 교정
카드 조합 문장이 부자연스러울 때 LLM이 교정 제안

### AI 동작 2: STT 상대방 음성 인식
TTS 발화 후 상대방 음성을 인식하여 대화 문맥 파악

### 문장 교정 LLM 프롬프트
```
AAC 카드 조합 문장: "{currentMessage}"
자연스러운 한국어 존댓말로 교정하세요.
이미 자연스러우면 그대로 반환.
JSON: {"corrected": "교정 문장", "changed": true/false, "reason": "이유"}
```

### STT 흐름
```
1. 사용자 [말하기] → TTS 발화
2. TTS 완료 → SpeechRecognition 시작 (5초 타임아웃)
3. 상대방 음성 인식 → sttResult 저장
4. LLM에 전달: {userSaid, partnerSaid}
5. LLM 분석 → 다음 추천 카드 갱신
```

### STT 구현 코드 스케치
```typescript
async function listenSTT(timeoutMs = 5000): Promise<string | null> {
  return new Promise((resolve) => {
    if (!('webkitSpeechRecognition' in window)) {
      resolve(null);
      return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;

    const timer = setTimeout(() => {
      recognition.stop();
      resolve(null);
    }, timeoutMs);

    recognition.onresult = (event) => {
      clearTimeout(timer);
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };
    recognition.onerror = () => { clearTimeout(timer); resolve(null); };
    recognition.start();
  });
}
```

### 논문 근거
- Cai et al. (2024, Nature Communications): LLM + STT → ALS 환자 소통 57% 효율 증가
- Kristensson & Vertanen (2012, ASSETS): 음성 인식 + 텍스트 예측 결합
- Higginbotham & Wilkins (1999): 대화 이력 → 반복 발화 속도 50% 향상

---

## 7. AI 통합 지점 #6: 스마트 카드 정렬

### 파일: `src/components/cards/CardGrid.tsx`

### AI 동작
사용 빈도 + 문맥에 따라 카드 순서를 동적 재배열하고,
관련성 높은 카드에 시각적 강조 적용

### 구현 계획
```typescript
interface CardSortInput {
  cards: Card[];
  selectedCards: Card[];
  history: string[];
  usageFrequency: Record<string, number>;  // 카드별 사용 횟수
}

interface CardSortOutput {
  sortedCardIds: string[];
  highlightedIds: string[];
}
```

### 논문 근거
- Thistle & Wilkinson (2015): 시각적 강조 → 카드 선택 속도 영향
- Wilkinson & McIlvane (2002): 디스플레이 구성 → 선택 정확도

---

## 8. AI 통합 지점 #7: 한국어 자동 문법

### 파일: `src/lib/grammar.ts`

### 현재 동작
규칙 기반 자동 조사 삽입 (받침 판별, 카테고리/동사 유형 분석)
→ 커버리지 약 80~90%

### AI 동작
LLM이 카드 조합을 자연스러운 한국어 문장으로 변환
→ 복합 조사(에게, 한테, (으)로), 높임말, 연결어미, 문맥 기반 은/는 vs 이/가 구분

### LLM 프롬프트
```
AAC 카드 조합을 자연스러운 한국어 존댓말 문장으로 변환하세요.

카드: [{text: "나", category: "person"}, {text: "학교", category: "place"}, {text: "가요", category: "action"}]

규칙:
1. 적절한 조사 삽입 (은/는, 이/가, 을/를, 에, 에서, 에게 등)
2. 존댓말(~요 체) 유지
3. 어순 최적화
4. 카드에 없는 단어 추가하지 않기

JSON: {"sentence": "나는 학교에 가요", "particles": [{"after": "나", "particle": "는"}, {"after": "학교", "particle": "에"}]}
```

### 한국어 문법 특수 케이스 (LLM 필요)
| 케이스 | 규칙 한계 | LLM 해결 |
|--------|----------|----------|
| 은/는 vs 이/가 | 주제 vs 주어 구분 불가 | 대화 문맥으로 판단 |
| 에게 vs 한테 | 규칙으로 구분 어려움 | 구어/문어 문맥 판단 |
| (으)로 | 방향/수단/재료 구분 | 동사 의미 분석 |
| 높임말 | 드세요/주세요 변환 | 상대방에 따라 자동 |
| 연결어미 | -고, -지만, -면 | 문장 관계 분석 |

### 논문 근거
- 김영태 외 (2003): 한국어 핵심어휘 234개의 문법적 특성
- 권순복 & 김수진 (2019): 한국어 AAC 체계 설계의 언어학적 고려

---

## 9. AI 통합 지점 #8: 기록 분석 + 패턴 학습

### 파일: `src/components/screens/HistoryScreen.tsx`

### AI 동작
발화 기록을 분석하여 사용자 패턴을 학습하고,
"다음에 말할 문장" 3~5개를 기록 화면 상단에 추천

### 분석 항목
1. **빈도 분석**: 자주 쓰는 문장 TOP 10
2. **시간대별 패턴**: 아침에 "배고파요" 자주 → 아침에 자동 추천
3. **연속 패턴**: "안녕하세요" 다음에 "이름이 뭐예요?" → 다음 문장 예측
4. **상황 추론**: "주사", "아파요" 연속 → 병원 상황판 전환 제안

### LLM 프롬프트
```
AAC 사용자의 최근 발화 기록입니다:
{history.slice(0, 50).join('\n')}

현재 시간: {time}

사용자가 다음에 말할 가능성이 높은 문장 3개를 추천하세요.
짧고 실용적인 문장을 우선하세요.

JSON: [{"text": "문장", "reason": "이유", "confidence": 0.9}, ...]
```

### 논문 근거
- Valencia et al. (2023, CHI): LLM 기반 AAC 소통 속도/다양성 향상
- Shen et al. (2022, ASSETS): 언어모델 기반 문장 예측 실시간 검증

---

## 10. 인프라 아키텍처

### 10.1 필요 파일 (신규 생성)
```
src/lib/ai.ts              — LLM 통합 메인 모듈
src/lib/ai-prompts.ts      — LLM 프롬프트 템플릿 모음
src/lib/ai-cache.ts        — 응답 캐시 (동일 입력 재사용)
src/lib/stt.ts             — Web Speech API STT 래퍼
src/hooks/useAI.ts         — React 훅 (useSmartSuggestions, usePhraseGeneration 등)
src/store/useAIStore.ts    — AI 상태 관리 (추천 결과, 로딩, 에러)
```

### 10.2 src/lib/ai.ts 설계
```typescript
// LLM 연결 설정
interface AIConfig {
  baseUrl: string;        // LLM 서버 URL
  modelId: string;        // 모델 ID
  apiKey?: string;        // API 키 (선택적)
  timeout: number;        // 요청 타임아웃 (ms)
  maxRetries: number;     // 재시도 횟수
}

// 환경변수: VITE_AI_API_URL, VITE_AI_MODEL_ID, VITE_AI_API_KEY

class AACLLMClient {
  private config: AIConfig;
  private cache: Map<string, { result: unknown; timestamp: number }>;

  async complete(options: {
    systemPrompt: string;
    userPrompt: string;
    maxTokens: number;
    temperature: number;
  }): Promise<{ text: string }>;

  // 통합 지점별 전용 메서드
  async getSuggestions(input: SuggestionInput): Promise<string[]>;
  async generatePhrases(input: PhraseInput): Promise<PhraseOutput>;
  async correctSentence(sentence: string): Promise<CorrectionOutput>;
  async detectSituation(input: SituationInput): Promise<SituationOutput>;
  async convertToSentence(cards: Card[]): Promise<string>;
  async analyzeHistory(history: string[]): Promise<HistoryAnalysis>;
}
```

### 10.3 Vite 환경변수
```env
# .env.local (예시)
VITE_AI_API_URL=http://localhost:8080/v1
VITE_AI_MODEL_ID=your-model-name
VITE_AI_API_KEY=optional-key
VITE_AI_ENABLED=true
VITE_AI_CACHE_TTL=300000   # 캐시 유효시간 5분
```

### 10.4 오프라인/폴백 전략
```
LLM 서버 연결 가능?
├─ Yes → LLM 추천 사용
│   └─ 응답 500ms 초과?
│       ├─ Yes → 규칙 기반 폴백 + 백그라운드 LLM 결과 캐시
│       └─ No → LLM 결과 바로 표시
└─ No → 규칙 기반 폴백 (현재 동작 그대로)
    ├─ grammar.ts: 규칙 기반 자동 조사
    ├─ SuggestionBar: 정적 매핑 추천
    └─ QuickPhrases: 사용자 등록 문장만 표시
```

### 10.5 성능 최적화
- **프리페치**: 화면 전환 시 다음 화면 AI 결과 미리 요청
- **캐시**: 같은 입력에 대해 5분간 결과 캐시
- **디바운스**: 카드 선택 200ms 후 AI 요청 (연속 선택 시 불필요 요청 방지)
- **스트리밍**: LLM 스트리밍 응답 지원 시 부분 결과 즉시 표시
- **배치**: 여러 AI 요청을 하나로 묶어 전송 (대화 세션 관리)

---

## 11. 논문 참고 목록

### AAC + AI/LLM 연구
| 논문 | 발행 | 핵심 기여 |
|------|------|----------|
| Valencia et al. (2023) | CHI | LLM이 AAC 소통 속도/다양성 2배 향상 |
| Cai et al. (2024) | Nature Communications | LLM + STT → ALS 환자 소통 57% 효율 증가 |
| Shen et al. (2022) | ASSETS | 대형 언어모델 AAC 문장 예측 실시간 검증 |
| Trnka et al. (2009) | NAACL | N-gram AAC 단어 예측 → 입력 40% 감소 |
| Trnka & McCoy (2008) | ACL | 개인화 언어 모델 적응 |
| Vertanen & Kristensson (2011) | ASSETS | 장애인 대상 단어 예측 실증 |
| Vertanen et al. (2014) | CHI | 운동장애 사용자 예측 텍스트 최적화 |

### AAC 설계/어휘 연구
| 논문 | 발행 | 핵심 기여 |
|------|------|----------|
| Beukelman & Mirenda (2013) | 5th Ed. | Core+Fringe 어휘 모델 |
| Light & McNaughton (2014) | AAC Journal | 의사소통 역량 향상 설계 원칙 |
| Beukelman & Light (2020) | 6th Ed. | 상황 기반 어휘 조직 가이드라인 |
| Thistle & Wilkinson (2015) | AAC Journal | Fitzgerald Key 색상 코딩 임상 현황 |
| 김영태 외 (2003) | 한국언어청각학회 | 한국어 핵심어휘 234개 조사 |
| 권순복 & 김수진 (2019) | 특수교육연구 | 한국어 AAC 체계 언어학적 설계 |
| Higginbotham & Wilkins (1999) | AAC Journal | 대화 이력 활용 → 발화 속도 50% 향상 |
| Higginbotham et al. (2007) | AAC Journal | 대화 문맥이 발화 속도에 미치는 영향 |
| Wisenburn & Higginbotham (2008) | AAC Journal | 단어/문장 예측의 커뮤니케이션 효과 |
| Schlosser & Koul (2015) | AAC Journal | 상황별 어휘 선택의 성공률 영향 |
| Wilkinson & McIlvane (2002) | AAC Journal | 디스플레이 구성 → 선택 정확도 |
| Dada & Alant (2009) | AAC Journal | 문화적 맥락 AAC 어휘 선정 |
| Kristensson & Vertanen (2012) | ASSETS | 음성 인식 + 텍스트 예측 결합 |
| Cabello & Bertola (2018) | Frontiers | ARASAAC 픽토그램 투명성 검증 |

---

## 부록: AI 통합 지점별 코드 위치 요약

| 파일 | 통합 지점 | 주석 위치 |
|------|----------|----------|
| `src/components/cards/SuggestionBar.tsx` | #1 스마트 카드 추천 | 파일 상단 |
| `src/components/screens/QuickPhrasesScreen.tsx` | #2 개인화 문장 생성 | 파일 상단 |
| `src/components/screens/SpeakScreen.tsx` | #3 대화 흐름 총괄 | 파일 상단 |
| `src/components/screens/SituationScreen.tsx` | #4 상황 자동 감지 | 파일 상단 |
| `src/components/layout/OutputBar.tsx` | #5 문장 교정 + STT | 파일 상단 |
| `src/components/cards/CardGrid.tsx` | #6 스마트 카드 정렬 | 파일 상단 |
| `src/lib/grammar.ts` | #7 한국어 자동 문법 | 파일 상단 + 함수별 |
| `src/components/screens/HistoryScreen.tsx` | #8 기록 분석 + 패턴 | 파일 상단 |
