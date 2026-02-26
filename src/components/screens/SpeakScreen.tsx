// ========================================
// SpeakScreen.tsx - 말하기 화면 (메인 AAC 화면)
//
// 현재 구조: EmergencyBar → SuggestionBar → CategoryBar → CardGrid
//
// 🤖 AI TODO [대화 흐름 총괄 제어 - AI 통합 지점 #3]
// ───────────────────────────────────────────────────
//
// ■ 역할: 말하기 화면 전체의 AI 통합 허브
//   각 하위 컴포넌트(SuggestionBar, CardGrid, OutputBar)에 AI 결과를 분배하고,
//   사용자의 전체 대화 흐름을 관리하는 "대화 세션 매니저" 역할
//
// ■ AI 대화 세션 관리:
//   1. 세션 시작: 앱 열 때 or 일정 시간 비활성 후 재사용 시
//   2. 문맥 누적: 카드 선택 → 발화 → 상대 응답(STT) → 다음 카드 선택... 반복
//   3. 세션 종료: 긴 비활성 or 사용자 명시적 종료
//
// ■ AI가 조율할 하위 컴포넌트별 데이터 흐름:
//
//   [EmergencyBar]
//   └→ AI 역할 없음 (긴급 상황은 항상 고정 노출, 안전상 AI 개입 불가)
//
//   [SuggestionBar] ← AI 핵심
//   └→ AI가 실시간 추천 카드 ID 배열을 전달
//      입력: 현재 선택 카드 + 대화 문맥 + 시간대
//      출력: suggestedCardIds[] (5~8개)
//
//   [CategoryBar]
//   └→ AI가 "추천 카테고리 순서" 제안 가능
//      예) 대화 문맥이 음식 관련 → 'food' 카테고리를 앞으로 이동
//      예) 감정 표현 부족 감지 → 'feeling' 카테고리 강조 표시
//
//   [CardGrid]
//   └→ AI가 카드 표시 순서를 동적 재배열
//      예) 자주 사용하는 카드를 상단에 배치
//      예) 현재 문맥과 관련 높은 카드에 시각적 강조 (테두리 등)
//
// ■ 향후 추가 컴포넌트:
//   [ConversationContextBar] (신규)
//   └→ STT로 인식한 상대방 말을 표시 + LLM이 파악한 대화 주제 표시
//      예) "상대방: 뭐 먹고 싶어?" → AI가 음식 카드 자동 추천
//
// ■ LLM 프롬프트 예시 (대화 세션 관리):
//   ```
//   [시스템] 당신은 AAC 앱의 대화 보조 AI입니다.
//   사용자는 말을 할 수 없어 카드를 눌러 소통합니다.
//
//   [대화 기록]
//   사용자: "안녕하세요" (카드 발화)
//   상대방: "안녕! 오늘 뭐 했어?" (STT 인식)
//   사용자: (현재 카드 선택 중...)
//
//   [현재 상태]
//   선택된 카드: ["학교"]
//   시간: 오후 4시 (하교 후)
//   자주 쓰는 패턴: 학교 → 공부 or 놀다
//
//   [요청] 다음을 JSON으로 응답하세요:
//   1. suggestedCards: 추천 카드 ID 5개
//   2. suggestedCategory: 추천 카테고리
//   3. conversationTopic: 현재 대화 주제 (한 단어)
//   ```
//
// ■ 논문 근거:
//   - Light & McNaughton (2014): AAC 사용자의 의사소통 역량 향상을 위한 설계 원칙
//   - Higginbotham et al. (2007, Augmentative and Alternative Communication):
//     대화 문맥이 AAC 사용자의 발화 속도에 미치는 영향 분석
//   - Valencia et al. (2023, CHI): LLM + 대화 문맥 → AAC 소통 속도/다양성 2배 향상
//   - Wisenburn & Higginbotham (2008): AAC에서 단어/문장 예측이 커뮤니케이션 비율에 미치는 효과
// ========================================

import EmergencyBar from '../cards/EmergencyBar';
import SuggestionBar from '../cards/SuggestionBar';
import CategoryBar from '../cards/CategoryBar';
import CardGrid from '../cards/CardGrid';

export default function SpeakScreen() {
  return (
    <>
      <EmergencyBar />
      <SuggestionBar />
      <CategoryBar />
      <CardGrid />
    </>
  );
}
