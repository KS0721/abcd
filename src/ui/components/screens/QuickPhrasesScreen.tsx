// ========================================
// QuickPhrasesScreen.tsx - 빠른 문장 화면
// 터치 → 크게보기(이미지+글씨) + TTS 발화
// ========================================

import { useState, useCallback, useMemo } from 'react';
import { useUserDataStore } from '../../../domains/user-data/store/useUserDataStore.ts';
import { useUIStore } from '../../store/useUIStore.ts';
import { getFrequentPhrases } from '../../../domains/user-data/services/usageStatsService.ts';
import { DEFAULT_CARDS } from '../../../domains/card/data/index.ts';
import type { Card } from '../../../domains/card/models.ts';

export default function QuickPhrasesScreen() {
  const quickPhrases = useUserDataStore((s) => s.quickPhrases);
  const addQuickPhrase = useUserDataStore((s) => s.addQuickPhrase);
  const removeQuickPhrase = useUserDataStore((s) => s.removeQuickPhrase);
  const updateQuickPhrase = useUserDataStore((s) => s.updateQuickPhrase);
  const openListenerModal = useUIStore((s) => s.openListenerModal);

  // 전체 카드 텍스트→카드 매핑 (픽토그램 검색용)
  const textToCardMap = useMemo(() => {
    const map = new Map<string, Card>();
    Object.values(DEFAULT_CARDS).forEach((cards) =>
      cards.forEach((c) => map.set(c.text, c))
    );
    return map;
  }, []);

  // 빈도순 정렬
  const sortedPhrases = useMemo(() => {
    const freqData = getFrequentPhrases(100);
    const freqMap = new Map(freqData.map((p) => [p.text, p.count]));
    return quickPhrases
      .map((phrase, originalIndex) => ({ phrase, originalIndex, freq: freqMap.get(phrase) || 0 }))
      .sort((a, b) => b.freq - a.freq);
  }, [quickPhrases]);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState('');

  const handleAdd = useCallback(() => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    addQuickPhrase(trimmed);
    setNewText('');
    setIsAdding(false);
  }, [newText, addQuickPhrase]);

  const handleEdit = useCallback((index: number) => {
    setEditIndex(index);
    setEditText(quickPhrases[index]);
  }, [quickPhrases]);

  const handleSaveEdit = useCallback(() => {
    if (editIndex === null) return;
    const trimmed = editText.trim();
    if (!trimmed) return;
    updateQuickPhrase(editIndex, trimmed);
    setEditIndex(null);
    setEditText('');
  }, [editIndex, editText, updateQuickPhrase]);

  const handleDelete = useCallback((index: number) => {
    removeQuickPhrase(index);
    if (editIndex === index) {
      setEditIndex(null);
      setEditText('');
    }
  }, [removeQuickPhrase, editIndex]);

  // 문장에서 매칭되는 카드 찾기 (픽토그램용)
  const findCardForPhrase = useCallback((phrase: string): Card | null => {
    // 1. 정확히 매칭
    const exact = textToCardMap.get(phrase);
    if (exact) return exact;
    // 2. 단어별 매칭 (첫 매칭 사용)
    const words = phrase.split(/\s+/);
    for (const word of words) {
      const match = textToCardMap.get(word);
      if (match) return match;
    }
    return null;
  }, [textToCardMap]);

  // 빠른 문장 터치 → 크게보기 + 말하기 (픽토그램 포함)
  const handlePhraseClick = useCallback((phrase: string) => {
    const card = findCardForPhrase(phrase);
    const cards = card ? [card] : [];
    openListenerModal(phrase, false, cards, true);
  }, [openListenerModal, findCardForPhrase]);

  const sectionStyle: React.CSSProperties = {
    padding: 'var(--spacing-md)',
    background: 'var(--color-surface)',
  };

  const phraseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderBottom: '1px solid var(--color-border)',
  };

  const phraseTextStyle: React.CSSProperties = {
    flex: 1,
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    padding: 'var(--spacing-xs) 0',
  };

  const btnStyle: React.CSSProperties = {
    padding: '10px 14px',
    minHeight: '44px',
    minWidth: '44px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-base)',
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{
        padding: 'var(--spacing-md)', background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
          빠른 문장
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          style={{
            ...btnStyle,
            background: 'var(--color-primary)',
            color: 'white',
            padding: '8px 14px',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          + 추가
        </button>
      </div>

      {isAdding && (
        <div style={{
          ...sectionStyle,
          display: 'flex', gap: 'var(--spacing-sm)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <input
            style={inputStyle}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="새 문장을 입력하세요"
            autoFocus
          />
          <button
            onClick={handleAdd}
            style={{ ...btnStyle, background: 'var(--color-primary)', color: 'white' }}
          >
            저장
          </button>
          <button
            onClick={() => { setIsAdding(false); setNewText(''); }}
            style={{ ...btnStyle, background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
          >
            취소
          </button>
        </div>
      )}

      <div style={sectionStyle}>
        {sortedPhrases.length === 0 ? (
          <p style={{
            textAlign: 'center', color: 'var(--color-text-muted)',
            padding: 'var(--spacing-xl) 0', fontSize: 'var(--font-size-base)',
          }}>
            저장된 문장이 없습니다
          </p>
        ) : (
          sortedPhrases.map(({ phrase, originalIndex }) => (
            <div key={originalIndex} style={phraseStyle}>
              {editIndex === originalIndex ? (
                <>
                  <input
                    style={inputStyle}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    style={{ ...btnStyle, background: 'var(--color-primary)', color: 'white' }}
                  >
                    저장
                  </button>
                  <button
                    onClick={() => { setEditIndex(null); setEditText(''); }}
                    style={{ ...btnStyle, background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <div
                    style={phraseTextStyle}
                    onClick={() => handlePhraseClick(phrase)}
                  >
                    {phrase}
                  </div>
                  <button
                    onClick={() => handleEdit(originalIndex)}
                    style={{ ...btnStyle, background: 'var(--color-primary)', color: 'white' }}
                    aria-label="수정"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(originalIndex)}
                    style={{ ...btnStyle, background: 'var(--color-danger)', color: 'white' }}
                    aria-label="삭제"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    삭제
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{
        padding: 'var(--spacing-md)', textAlign: 'center',
        color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)',
      }}>
        문장을 터치하면 크게 보여주면서 읽어줍니다
      </div>
    </div>
  );
}
