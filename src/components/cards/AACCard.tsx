import { memo, useCallback, useRef } from 'react';
import type { Card } from '../../types';
import { useSettingsStore } from '../../store/useSettingsStore';
import CardPictogram from './CardPictogram';
import styles from '../../styles/AACCard.module.css';

interface Props {
  card: Card;
  isSelected: boolean;
  isEditMode: boolean;
  onSelect: (card: Card) => void;
  onDelete?: (cardId: string) => void;
  onEdit?: (card: Card) => void;
}

const AACCard = memo(function AACCard({ card, isSelected, isEditMode, onSelect, onDelete, onEdit }: Props) {
  const dwellTime = useSettingsStore((s) => s.dwellTime);
  const dwellTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dwellComplete = useRef(false);

  const handleClick = useCallback(() => {
    if (isEditMode) return;
    // dwellTime > 0이면 pointerDown/Up으로 처리하므로 click 무시
    if (dwellTime > 0) return;
    onSelect(card);
  }, [card, isEditMode, onSelect, dwellTime]);

  const handlePointerDown = useCallback(() => {
    if (isEditMode || dwellTime === 0) return;
    dwellComplete.current = false;
    dwellTimer.current = setTimeout(() => {
      dwellComplete.current = true;
      onSelect(card);
      if (navigator.vibrate) navigator.vibrate(30);
    }, dwellTime);
  }, [card, isEditMode, onSelect, dwellTime]);

  const handlePointerUp = useCallback(() => {
    if (dwellTimer.current) {
      clearTimeout(dwellTimer.current);
      dwellTimer.current = null;
    }
  }, []);

  const handleDelete = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete?.(card.id);
  }, [card.id, onDelete]);

  const handleEdit = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit?.(card);
  }, [card, onEdit]);

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
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      role="button"
      aria-pressed={isSelected}
      aria-label={card.text}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (dwellTime === 0) onSelect(card);
        }
      }}
    >
      {isEditMode && <div className={styles.dragHandle}>
        <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>
      </div>}

      {/* 편집 모드: 삭제 + 수정 버튼 (사용자 카드만) */}
      {isEditMode && card.isUserCard && (
        <>
          <button className={styles.deleteBtn} onClick={handleDelete} onTouchEnd={handleDelete} aria-label="삭제">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <button className={styles.editBtn} onClick={handleEdit} onTouchEnd={handleEdit} aria-label="수정">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </>
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
