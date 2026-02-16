import { useCallback } from 'react';
import type { Card } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useScanningStore } from '../../store/useScanningStore';
import { useScanHighlight } from '../../hooks/useScanning';
import AACCard from './AACCard';
import styles from '../../styles/CardGrid.module.css';
import cardStyles from '../../styles/AACCard.module.css';
import scanStyles from '../../styles/Scanning.module.css';

/** 스캐닝 돌아가기 버튼 */
function ScanBackButton() {
  const highlighted = useScanHighlight('card', 0);
  return (
    <div
      className={highlighted ? scanStyles.backBtnHighlight : scanStyles.backBtn}
      data-scan-phase="card"
      data-scan-index={0}
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span>돌아가기</span>
    </div>
  );
}

/** 스캐닝 하이라이트가 적용된 카드 래퍼 */
function ScannableCard({ index, card, isSelected, isEditMode, onSelect, onDelete }: {
  index: number;
  card: Card;
  isSelected: boolean;
  isEditMode: boolean;
  onSelect: (card: Card) => void;
  onDelete?: (cardId: string) => void;
}) {
  const highlighted = useScanHighlight('card', index);
  return (
    <div
      className={highlighted ? scanStyles.highlightCard : undefined}
      data-scan-phase="card"
      data-scan-index={index}
    >
      <AACCard
        card={card}
        isSelected={isSelected}
        isEditMode={isEditMode}
        onSelect={onSelect}
        onDelete={onDelete}
      />
    </div>
  );
}

export default function CardGrid() {
  const currentCategory = useAppStore((s) => s.currentCategory);
  const cards = useAppStore((s) => s.cards[s.currentCategory] || []);
  const selectedCards = useAppStore((s) => s.selectedCards);
  const editMode = useAppStore((s) => s.editMode);
  const selectCard = useAppStore((s) => s.selectCard);
  const deselectCard = useAppStore((s) => s.deselectCard);
  const deleteUserCard = useAppStore((s) => s.deleteUserCard);
  const openAddCardModal = useAppStore((s) => s.openAddCardModal);
  const isScanning = useScanningStore((s) => s.isActive);

  const selectedIds = new Set(selectedCards.map((c) => c.id));

  const handleSelect = useCallback((card: Card) => {
    if (selectedIds.has(card.id)) {
      deselectCard(card.id);
    } else {
      selectCard(card);
    }
  }, [selectedIds, selectCard, deselectCard]);

  const handleDelete = useCallback((cardId: string) => {
    deleteUserCard(currentCategory, cardId);
  }, [currentCategory, deleteUserCard]);

  const handleAddCard = useCallback(() => {
    openAddCardModal(currentCategory);
  }, [currentCategory, openAddCardModal]);

  return (
    <div className={styles.cardsArea} data-scan-scroll>
      <div className={styles.cardsGrid}>
        {/* 스캐닝 모드: 돌아가기 버튼 */}
        {isScanning && <ScanBackButton />}

        {cards.map((card, i) => (
          <ScannableCard
            key={card.id}
            index={i + 1}
            card={card}
            isSelected={selectedIds.has(card.id)}
            isEditMode={editMode}
            onSelect={handleSelect}
            onDelete={handleDelete}
          />
        ))}

        {/* 카드 추가 버튼 (스캐닝 중이 아닐 때만) */}
        {!isScanning && (
          <div className={cardStyles.addCard} onClick={handleAddCard} role="button" tabIndex={0}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>추가</span>
          </div>
        )}
      </div>
    </div>
  );
}
