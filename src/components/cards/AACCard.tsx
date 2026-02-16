import { memo, useCallback } from 'react';
import type { Card } from '../../types';
import CardPictogram from './CardPictogram';
import styles from '../../styles/AACCard.module.css';

interface Props {
  card: Card;
  isSelected: boolean;
  isEditMode: boolean;
  onSelect: (card: Card) => void;
  onDelete?: (cardId: string) => void;
}

const AACCard = memo(function AACCard({ card, isSelected, isEditMode, onSelect, onDelete }: Props) {
  const handleClick = useCallback(() => {
    if (isEditMode) return;
    onSelect(card);
  }, [card, isEditMode, onSelect]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(card.id);
  }, [card.id, onDelete]);

  const classNames = [
    styles.card,
    isSelected && styles.selected,
    card.emergency && styles.emergency,
    isEditMode && styles.editing,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      onClick={handleClick}
      role="button"
      aria-pressed={isSelected}
      aria-label={card.text}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {isEditMode && <div className={styles.dragHandle}>
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
      </div>}

      {isEditMode && card.isUserCard && (
        <button className={styles.deleteBtn} onClick={handleDelete} aria-label="삭제">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}

      <CardPictogram
        keyword={card.arasaacKeyword}
        pictogramId={card.pictogramId}
        pictogramUrl={card.pictogramUrl}
        category={card.category}
        text={card.text}
      />

      <div className={styles.text}>{card.text}</div>
    </div>
  );
});

export default AACCard;
