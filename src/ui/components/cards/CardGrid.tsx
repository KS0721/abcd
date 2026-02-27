// ========================================
// CardGrid.tsx - 카드 그리드 (카테고리별 카드 표시)
//
// 사용 빈도 + 시간대 + 연속 패턴 기반 스마트 정렬
// ========================================

import { useCallback, useMemo } from 'react';
import type { Card } from '../../../domains/card/models.ts';
import { useCardStore } from '../../../domains/card/store/useCardStore.ts';
import { useSentenceStore } from '../../../domains/sentence/store/useSentenceStore.ts';
import { useUIStore } from '../../store/useUIStore.ts';
import { useScanningStore } from '../../../domains/scanning/store/useScanningStore.ts';
import { useScanHighlight } from '../../../domains/scanning/hooks/useScanning.ts';
import { getCardFrequencyMap, getFrequentCardsForNow, getCardsAfter } from '../../../domains/user-data/services/usageStatsService.ts';
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
function ScannableCard({ index, card, isSelected, isEditMode, onSelect, onDelete, onEdit }: {
  index: number;
  card: Card;
  isSelected: boolean;
  isEditMode: boolean;
  onSelect: (card: Card) => void;
  onDelete?: (cardId: string) => void;
  onEdit?: (card: Card) => void;
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
        onEdit={onEdit}
      />
    </div>
  );
}

export default function CardGrid() {
  const currentCategory = useCardStore((s) => s.currentCategory);
  const cards = useCardStore((s) => s.cards[s.currentCategory] || []);
  const selectedCards = useSentenceStore((s) => s.selectedCards);
  const editMode = useCardStore((s) => s.editMode);
  const selectCard = useSentenceStore((s) => s.selectCard);
  const deselectCard = useSentenceStore((s) => s.deselectCard);
  const deleteUserCard = useCardStore((s) => s.deleteUserCard);
  const openAddCardModal = useUIStore((s) => s.openAddCardModal);
  const openEditCardModal = useUIStore((s) => s.openEditCardModal);
  const isScanning = useScanningStore((s) => s.isActive);

  const selectedIds = new Set(selectedCards.map((c) => c.id));

  // 사용 빈도 + 시간대 + 연속 패턴 기반 스마트 정렬
  const sortedCards = useMemo(() => {
    // 편집 모드에서는 사용자가 직접 정렬하므로 원래 순서 유지
    if (editMode) return cards;

    const freqMap = getCardFrequencyMap();
    const timeCards = new Set(getFrequentCardsForNow(8));
    const lastCard = selectedCards.length > 0
      ? selectedCards[selectedCards.length - 1]
      : null;
    const afterCards = lastCard ? new Set(getCardsAfter(lastCard.id, 8)) : new Set<string>();

    // 점수 = 빈도(기본) + 시간대 보너스 + 연속 패턴 보너스
    return [...cards].sort((a, b) => {
      const scoreA = (freqMap[a.id] || 0)
        + (timeCards.has(a.id) ? 100 : 0)
        + (afterCards.has(a.id) ? 200 : 0);
      const scoreB = (freqMap[b.id] || 0)
        + (timeCards.has(b.id) ? 100 : 0)
        + (afterCards.has(b.id) ? 200 : 0);
      return scoreB - scoreA;
    });
  }, [cards, selectedCards, editMode]);

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

  const handleEdit = useCallback((card: Card) => {
    openEditCardModal(card, currentCategory);
  }, [currentCategory, openEditCardModal]);

  const handleAddCard = useCallback(() => {
    openAddCardModal(currentCategory);
  }, [currentCategory, openAddCardModal]);

  return (
    <div className={styles.cardsArea} data-scan-scroll>
      <div className={styles.cardsGrid}>
        {/* 스캐닝 모드: 돌아가기 버튼 */}
        {isScanning && <ScanBackButton />}

        {sortedCards.map((card, i) => (
          <ScannableCard
            key={card.id}
            index={i + 1}
            card={card}
            isSelected={selectedIds.has(card.id)}
            isEditMode={editMode}
            onSelect={handleSelect}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}

        {/* 카드 추가 버튼 (스캐닝 중이 아닐 때만) */}
        {!isScanning && (
          <div
            className={cardStyles.addCard}
            onClick={handleAddCard}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAddCard(); } }}
            role="button"
            tabIndex={0}
            aria-label="카드 추가"
          >
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
