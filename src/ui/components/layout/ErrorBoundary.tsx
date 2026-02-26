// ========================================
// ErrorBoundary.tsx - 앱 크래시 방지 안전망
//
// AAC 앱은 사용자의 유일한 의사소통 수단이므로 절대 멈추면 안 됨
// React 렌더링 에러 발생 시 전체 앱 대신 복구 UI 표시
// + 긴급 의사소통 버튼 (앱이 죽어도 기본 의사소통 가능)
//
// 논문 근거:
//   - Beukelman & Mirenda (2013): AAC 시스템은 "communication lifeline"
//     → 가용성(availability)이 최우선 요구사항
//   - McNaughton & Light (2013): 신뢰성(reliability)이 AAC 기술 수용의 핵심 요인
//   - Blackstone et al. (2007, AAC Journal): 긴급 상황 의사소통 접근성은
//     AAC 시스템의 최소 요구사항 → 앱 크래시 시에도 긴급 발화 가능해야 함
// ========================================

import { Component, type ReactNode } from 'react';

// 앱 크래시 시에도 사용 가능한 긴급 문구
// React 의존 없이 직접 speechSynthesis API 사용
const EMERGENCY_PHRASES = [
  { text: '도와주세요', color: '#DC2626' },
  { text: '아파요', color: '#DC2626' },
  { text: '물 주세요', color: '#2563EB' },
  { text: '화장실 가고 싶어요', color: '#2563EB' },
];

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] 앱 전체 에러:', error, errorInfo);

    try {
      const logs = JSON.parse(localStorage.getItem('aac_error_log') || '[]');
      logs.push({
        screen: 'global',
        message: error.message,
        stack: error.stack?.slice(0, 500),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('aac_error_log', JSON.stringify(logs.slice(-20)));
    } catch { /* 무시 */ }
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  /** 긴급 문구 직접 TTS 발화 (React 훅 없이 Web Speech API 직접 사용) */
  handleEmergencySpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    u.rate = 0.9; // 긴급 상황: 약간 느리게
    u.volume = 1.0; // 최대 음량
    speechSynthesis.speak(u);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100dvh',
            gap: '1.5rem',
            padding: '2rem',
            fontFamily: 'sans-serif',
            textAlign: 'center',
            background: '#fff',
            color: '#222',
          }}
        >
          <div style={{ fontSize: '3rem' }}>!</div>
          <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            오류가 발생했습니다
          </p>

          {/* 긴급 의사소통 버튼: 앱이 죽어도 기본 의사소통 가능 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            width: '100%',
            maxWidth: '320px',
          }}>
            {EMERGENCY_PHRASES.map((item) => (
              <button
                key={item.text}
                onClick={() => this.handleEmergencySpeak(item.text)}
                style={{
                  padding: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  background: item.color,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  minHeight: '56px',
                }}
              >
                {item.text}
              </button>
            ))}
          </div>

          <button
            onClick={this.handleReload}
            style={{
              padding: '1rem 2.5rem',
              fontSize: '1.25rem',
              fontWeight: 700,
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              minHeight: '56px',
              minWidth: '200px',
            }}
          >
            다시 시작
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
