# 올인원 AAC

의사소통 약자를 위한 연구 기반 AAC(보완·대체 의사소통) 웹 애플리케이션

## 주요 기능

### 말하기
- **228개 카드**로 문장 조합 (8개 카테고리 · 114개 기본어휘 + 6개 긴급카드 + 108개 상황카드)
- **Fitzgerald Key 색상 체계** — 품사별 색상 코딩으로 문법 구조 시각 지원
- **한국어 문법 자동 정렬** — 주어·동사·목적어 순서 자동 배치
- **TTS 음성 출력** — 카드 터치 시 자동 발화, 전체 문장 읽기

### 상황판
- **9개 실생활 상황판** — 집, 병원, 식당, 학교, 어린이집, 차, 공원, 마트, 목욕
- 상황당 12개 핵심 카드로 즉시 사용 가능

### 카드 관리
- 카드 추가 / 수정 / 삭제
- ARASAAC API 아이콘 자동 검색
- 카메라 촬영으로 사진 카드 생성
- 한국어 활용형 → 기본형 자동 변환 (예: 먹어요 → 먹다)

### 접근성
- **3단계 자동 스캐닝** — 카테고리 → 카드 → 크게보기 (3초 간격)
  - 터치 = 선택 · 꾹 누르기 = 끄기 · 두번터치 = 화면이동
- **고대비 모드** 기본 활성화
- 긴급 상황 카드 강조 표시 (빨간 배경 + 경고 아이콘)
- 다크 모드, 글자 크기 조절

### 크게 보기
- 선택된 카드 전체화면 표시 + TTS 자동 재생
- "이 화면을 보여주세요" 안내 문구
- 긴급 상황 시 붉은 배경 강조

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | React 19 + TypeScript |
| 빌드 도구 | Vite 7 |
| 상태 관리 | Zustand 5 |
| 모바일 | Capacitor 7 (Android / iOS) |
| 스타일 | CSS Modules + CSS Variables |
| 픽토그램 | ARASAAC API + 커스텀 SVG 5종 |
| 배포 | GitHub Pages (PWA) |

## 프로젝트 구조

```
src/
├── components/
│   ├── cards/        # AACCard, CardGrid, CategoryBar, EmergencyBar
│   ├── layout/       # AppShell, Header, OutputBar, TabBar
│   ├── modals/       # ListenerModal, AddCard, EditCard, Confirm
│   ├── scanning/     # ScanningOverlay, ScanningIndicator
│   └── screens/      # SpeakScreen, SituationScreen, HistoryScreen, Settings
├── data/cards/       # 카드 데이터 (categories, default, emergency, situations)
├── hooks/            # useScanning, useTTS, useSwipeGesture, useDragDrop
├── store/            # Zustand 스토어 (app, scanning, settings, speech)
├── styles/           # CSS Modules + 전역 스타일
├── lib/              # ARASAAC API, 문법 처리
└── types/            # TypeScript 타입 정의
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 (localhost:3000)
npm run dev

# 빌드
npm run build

# Android 빌드
npm run cap:android
```

## 카테고리 (Fitzgerald Key)

| 카테고리 | 색상 | 예시 |
|---------|------|------|
| 표현 | 핑크 | 네, 아니요, 안녕, 고마워요 |
| 동작 | 초록 | 먹어요, 가요, 씻어요 |
| 감정 | 파랑 | 좋아요, 싫어요, 행복해요 |
| 사람 | 보라 | 엄마, 아빠, 선생님 |
| 장소 | 청록 | 집, 학교, 병원 |
| 음식 | 주황 | 밥, 빵, 물, 과자 |
| 시간 | 갈색 | 지금, 나중에, 오늘 |
| 사물 | 주황 | 옷, 신발, 가방, 핸드폰 |

## 라이선스

- ARASAAC 픽토그램: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
