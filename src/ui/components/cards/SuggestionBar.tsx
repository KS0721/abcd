// ========================================
// SuggestionBar.tsx - 다음 카드 추천 바
//
// 현재: 정적 매핑 기반 추천 (verbSuggestions.ts에서 동사→명사 매핑)
// 향후: LLM 기반 문맥 추천 확장 예정
// ========================================

import { useMemo, useCallback } from 'react';
import { useSentenceStore } from '../../../domains/sentence/store/useSentenceStore.ts';
import { DEFAULT_CARDS } from '../../../domains/card/data/index.ts';
import type { Card } from '../../../domains/card/models.ts';

// 핵심어휘: 카테고리 이동 없이 항상 접근 가능한 고빈도 단어
// 논문: Banajee et al. (2003) - 핵심어가 일상 대화의 80% 차지
// 논문: Robillard et al. (2014) - 핵심어 접근성이 사용률에 직접 영향
const CORE_WORD_IDS = ['ex_yes', 'ex_no', 'f_good', 'f_bad', 'ex_more', 'ex_not', 'ex_want'];

export default function SuggestionBar() {
  const activeSuggestions = useSentenceStore((s) => s.activeSuggestions);
  const selectedCards = useSentenceStore((s) => s.selectedCards);
  const selectCard = useSentenceStore((s) => s.selectCard);

  // 전체 카드 맵 (한 번만 생성)
  const allCardsMap = useMemo(() => {
    const map = new Map<string, Card>();
    Object.values(DEFAULT_CARDS).forEach((cards) =>
      cards.forEach((c) => map.set(c.id, c))
    );
    return map;
  }, []);

  // 핵심어휘 카드
  const coreWords = useMemo(() =>
    CORE_WORD_IDS
      .map((id) => allCardsMap.get(id))
      .filter((c): c is Card => !!c),
    [allCardsMap]
  );

  // 추천 카드 (activeSuggestions가 있을 때)
  const suggestions = useMemo(() => {
    if (!activeSuggestions) return [];
    const selectedIds = new Set(selectedCards.map((c) => c.id));
    return activeSuggestions
      .map((id) => allCardsMap.get(id))
      .filter((c): c is Card => !!c && !selectedIds.has(c.id));
  }, [activeSuggestions, selectedCards, allCardsMap]);

  const handleClick = useCallback((card: Card) => {
    selectCard(card);
  }, [selectCard]);

  // 추천이 있으면 추천 표시, 없으면 핵심어휘 표시
  const hasSuggestions = suggestions.length > 0;
  const displayCards = hasSuggestions ? suggestions : coreWords;
  const label = hasSuggestions ? '추천' : '핵심';

  return (
    <div data-no-swipe style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-sm)',
      padding: 'var(--spacing-sm) var(--spacing-md)',
      background: hasSuggestions ? 'var(--color-primary-bg)' : 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      overflowX: 'auto',
    }}>
      <span style={{
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        color: hasSuggestions ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
        {displayCards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleClick(card)}
            style={{
              padding: hasSuggestions ? '6px 12px' : '10px 18px',
              background: 'var(--color-surface)',
              border: `2px solid ${hasSuggestions ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: '24px',
              fontSize: hasSuggestions ? 'var(--font-size-sm)' : 'var(--font-size-base)',
              fontWeight: hasSuggestions ? 500 : 600,
              color: hasSuggestions ? 'var(--color-primary)' : 'var(--color-text-primary)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            {card.text}
          </button>
        ))}
      </div>
    </div>
  );
}
