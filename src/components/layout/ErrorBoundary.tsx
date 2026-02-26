// ========================================
// ErrorBoundary.tsx - 앱 크래시 방지 안전망
//
// AAC 앱은 사용자의 유일한 의사소통 수단이므로 절대 멈추면 안 됨
// React 렌더링 에러 발생 시 전체 앱 대신 복구 UI 표시
//
// 논문 근거:
//   - Beukelman & Mirenda (2013): AAC 시스템은 "communication lifeline"
//     → 가용성(availability)이 최우선 요구사항
//   - McNaughton & Light (2013): 신뢰성(reliability)이 AAC 기술 수용의 핵심 요인
// ========================================

import { Component, type ReactNode } from 'react';

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

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
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
          <p style={{ fontSize: '1rem', color: '#666' }}>
            아래 버튼을 눌러 다시 시작해 주세요
          </p>
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
