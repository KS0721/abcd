// ========================================
// ScreenErrorBoundary.tsx - 화면별 에러 격리
//
// 개별 화면(탭)의 렌더링 에러를 격리하여
// 다른 화면과 긴급 의사소통 기능은 정상 동작 유지
// ========================================

import { Component, type ReactNode } from 'react';

const EMERGENCY_PHRASES = [
  { text: '도와주세요', color: '#DC2626' },
  { text: '아파요', color: '#DC2626' },
  { text: '물 주세요', color: '#2563EB' },
  { text: '화장실 가고 싶어요', color: '#2563EB' },
];

interface Props {
  children: ReactNode;
  screenName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ScreenErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[ScreenErrorBoundary] ${this.props.screenName}:`, error, errorInfo);

    // 에러 로그 저장 (디버그용)
    try {
      const logs = JSON.parse(localStorage.getItem('aac_error_log') || '[]');
      logs.push({
        screen: this.props.screenName,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
      // 최근 20개만 유지
      localStorage.setItem('aac_error_log', JSON.stringify(logs.slice(-20)));
    } catch { /* 무시 */ }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    u.rate = 0.9;
    u.volume = 1.0;
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
            height: '100%',
            gap: '1rem',
            padding: '1.5rem',
            fontFamily: 'sans-serif',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {this.props.screenName} 화면에서 오류가 발생했습니다
          </p>

          {/* 긴급 의사소통 버튼 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            width: '100%',
            maxWidth: '280px',
          }}>
            {EMERGENCY_PHRASES.map((item) => (
              <button
                key={item.text}
                onClick={() => this.handleSpeak(item.text)}
                style={{
                  padding: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  background: item.color,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  minHeight: '48px',
                }}
              >
                {item.text}
              </button>
            ))}
          </div>

          <button
            onClick={this.handleRetry}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              minHeight: '48px',
            }}
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
