import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ui/components/layout/ErrorBoundary';
import './ui/styles/variables.css';
import './ui/styles/reset.css';
import './ui/styles/global.css';
import './ui/styles/responsive.css';

// 개발 모드에서 axe-core 접근성 검사 활성화
if (import.meta.env.DEV) {
  import('@axe-core/react').then((axe) => {
    import('react-dom').then((ReactDOM) => {
      axe.default(React, ReactDOM, 1000);
    });
  });
}

import React from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
