import { useMemo, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { DEFAULT_CARDS } from '../../data/cards';
import type { Card } from '../../types';

export default function SuggestionBar() {
  const activeSuggestions = useAppStore((s) => s.activeSuggestions);
  const selectedCards = useAppStore((s) => s.selectedCards);
  const selectCard = useAppStore((s) => s.selectCard);

  const suggestions = useMemo(() => {
    if (!activeSuggestions) return [];
    const selectedIds = new Set(selectedCards.map((c) => c.id));
    const allCards: Card[] = [];
    Object.values(DEFAULT_CARDS).forEach((cards) => allCards.push(...cards));
    return activeSuggestions
      .map((id) => allCards.find((c) => c.id === id))
      .filter((c): c is Card => !!c && !selectedIds.has(c.id));
  }, [activeSuggestions, selectedCards]);

  const handleClick = useCallback((card: Card) => {
    selectCard(card);
  }, [selectCard]);

  if (suggestions.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-sm)',
      padding: 'var(--spacing-sm) var(--spacing-md)',
      background: 'var(--color-primary-bg)',
      borderBottom: '1px solid var(--color-border)',
      overflowX: 'auto',
    }}>
      <span style={{
        fontSize: 'var(--font-size-sm)',
        fontWeight: 600,
        color: 'var(--color-primary)',
        whiteSpace: 'nowrap',
      }}>
        추천
      </span>
      <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
        {suggestions.map((card) => (
          <button
            key={card.id}
            onClick={() => handleClick(card)}
            style={{
              padding: '6px 12px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-primary)',
              borderRadius: '20px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 500,
              color: 'var(--color-primary)',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {card.text}
          </button>
        ))}
      </div>
    </div>
  );
}
