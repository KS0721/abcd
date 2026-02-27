// ========================================
// STTScreen.tsx - 상대방 음성 인식 (STT)
//
// Web Speech API 기반 실시간 한국어 음성→텍스트 변환
// 대화 상대가 말하면 화면에 텍스트로 표시
// AAC 사용자가 상대 말을 눈으로 확인 가능
// ========================================

import { useState, useCallback, useRef, useEffect } from 'react';

// Web Speech API 타입
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function createRecognition(): SpeechRecognitionInstance | null {
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) return null;
  return new SR() as SpeechRecognitionInstance;
}

interface Transcript {
  id: number;
  text: string;
  time: string;
}

export default function STTScreen() {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [supported] = useState(() =>
    !!(((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition))
  );
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const idCounter = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const wantListening = useRef(false);

  // 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, interim]);

  const startListening = useCallback(() => {
    if (!supported) {
      setError('이 브라우저는 음성 인식을 지원하지 않습니다');
      return;
    }

    setError(null);
    wantListening.current = true;

    const recognition = createRecognition();
    if (!recognition) return;

    recognition.lang = 'ko-KR';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        const text = result[0].transcript.trim();
        if (result.isFinal) {
          if (text) {
            const now = new Date();
            const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            setTranscripts((prev) => [...prev, {
              id: ++idCounter.current,
              text,
              time,
            }]);
          }
          setInterim('');
        } else {
          interimText += text;
        }
      }
      if (interimText) setInterim(interimText);
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      setError(`음성 인식 오류: ${e.error}`);
      setIsListening(false);
      wantListening.current = false;
    };

    // 자동 재시작 (브라우저가 끊으면)
    recognition.onend = () => {
      if (wantListening.current) {
        try { recognition.start(); } catch { /* 무시 */ }
      } else {
        setIsListening(false);
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch {
      setError('마이크 접근이 거부되었습니다');
    }
  }, [supported]);

  const stopListening = useCallback(() => {
    wantListening.current = false;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterim('');
  }, []);

  const handleToggle = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const handleClear = useCallback(() => {
    setTranscripts([]);
    setInterim('');
  }, []);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      wantListening.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-bg)',
      overflow: 'hidden',
    }}>
      {/* 헤더 */}
      <div style={{
        padding: 'var(--spacing-md)',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
          상대방 듣기
        </h2>
        {transcripts.length > 0 && (
          <button
            onClick={handleClear}
            style={{
              padding: '8px 14px',
              minHeight: '40px',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              background: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            지우기
          </button>
        )}
      </div>

      {/* 대화 내용 */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--spacing-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-sm)',
        }}
      >
        {transcripts.length === 0 && !interim && !isListening && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            color: 'var(--color-text-muted)',
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.4 }}>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
            <p style={{ fontSize: 'var(--font-size-base)', textAlign: 'center' }}>
              아래 마이크 버튼을 누르면<br/>상대방 말을 텍스트로 보여줍니다
            </p>
          </div>
        )}

        {transcripts.length === 0 && !interim && isListening && (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-size-lg)',
          }}>
            듣고 있습니다...
          </div>
        )}

        {transcripts.map((t) => (
          <div key={t.id} style={{
            padding: '12px 16px',
            background: 'var(--color-surface)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
          }}>
            <div style={{
              fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              lineHeight: 1.4,
              wordBreak: 'keep-all',
            }}>
              {t.text}
            </div>
            <div style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
              marginTop: '4px',
            }}>
              {t.time}
            </div>
          </div>
        ))}

        {/* 실시간 인식 중 텍스트 */}
        {interim && (
          <div style={{
            padding: '12px 16px',
            background: 'var(--color-primary-bg)',
            borderRadius: '12px',
            border: '2px dashed var(--color-primary)',
          }}>
            <div style={{
              fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
              fontWeight: 600,
              color: 'var(--color-primary)',
              lineHeight: 1.4,
              wordBreak: 'keep-all',
            }}>
              {interim}
            </div>
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          background: '#FEF2F2',
          color: '#DC2626',
          fontSize: 'var(--font-size-sm)',
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {/* 하단 컨트롤 */}
      <div style={{
        padding: 'var(--spacing-md)',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
      }}>
        <button
          onClick={handleToggle}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: 'none',
            background: isListening ? '#DC2626' : 'var(--color-primary)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isListening
              ? '0 0 0 8px rgba(220, 38, 38, 0.2)'
              : '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s ease',
            animation: isListening ? 'sttPulse 1.5s ease-in-out infinite' : 'none',
          }}
          aria-label={isListening ? '듣기 중지' : '듣기 시작'}
        >
          {isListening ? (
            // 정지 아이콘
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          ) : (
            // 마이크 아이콘
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          )}
        </button>
      </div>

      <style>{`
        @keyframes sttPulse {
          0%, 100% { box-shadow: 0 0 0 8px rgba(220, 38, 38, 0.2); }
          50% { box-shadow: 0 0 0 16px rgba(220, 38, 38, 0.1); }
        }
      `}</style>
    </div>
  );
}
