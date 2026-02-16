import { useCallback } from 'react';
import { SITUATION_BOARDS } from '../../data/cards';
import type { SituationId, Card, SituationCard } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useScanningStore } from '../../store/useScanningStore';
import { useScanHighlight } from '../../hooks/useScanning';
import AACCard from '../cards/AACCard';
import styles from '../../styles/CardGrid.module.css';
import scanStyles from '../../styles/Scanning.module.css';

const SITUATION_IDS = Object.keys(SITUATION_BOARDS) as SituationId[];

/** 스캐닝 하이라이트 적용된 상황 타일 */
function ScannableSituationTile({ index, board, onClick }: {
  index: number;
  board: typeof SITUATION_BOARDS[SituationId];
  onClick: () => void;
}) {
  const highlighted = useScanHighlight('category', index);

  return (
    <button
      onClick={onClick}
      className={highlighted ? scanStyles.highlightTile : undefined}
      data-scan-phase="category"
      data-scan-index={index}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-lg)', background: 'var(--color-surface)',
        border: '2px solid var(--color-border)', borderRadius: '16px',
        cursor: 'pointer', minHeight: '100px',
      }}
    >
      <span style={{ fontSize: '2rem' }}>{board.emoji}</span>
      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{board.name}</span>
    </button>
  );
}

/** 스캐닝 하이라이트 적용된 상황 카드 래퍼 */
function ScannableSituationCard({ index, card, onSelect }: {
  index: number;
  card: SituationCard;
  onSelect: (card: Card) => void;
}) {
  const highlighted = useScanHighlight('card', index);

  return (
    <div
      className={highlighted ? scanStyles.highlightCard : undefined}
      data-scan-phase="card"
      data-scan-index={index}
    >
      <AACCard
        card={{ ...card, category: 'expression' as const }}
        isSelected={false}
        isEditMode={false}
        onSelect={onSelect}
      />
    </div>
  );
}

export default function SituationScreen() {
  // 글로벌 상태 사용 (스캐닝이 제어할 수 있도록)
  const activeSituation = useAppStore((s) => s.activeSituation);
  const setActiveSituation = useAppStore((s) => s.setActiveSituation);
  const selectCard = useAppStore((s) => s.selectCard);
  const isScanning = useScanningStore((s) => s.isActive);

  const handleSituationClick = useCallback((id: SituationId) => {
    setActiveSituation(id);
  }, [setActiveSituation]);

  const handleBack = useCallback(() => {
    setActiveSituation(null);
  }, [setActiveSituation]);

  const handleCardSelect = useCallback((card: Card) => {
    selectCard(card);
  }, [selectCard]);

  // 상황판 카드 보기
  if (activeSituation) {
    const board = SITUATION_BOARDS[activeSituation as SituationId];
    if (!board) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
          padding: 'var(--spacing-md)', background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          {!isScanning && (
            <button onClick={handleBack} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 600,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              뒤로
            </button>
          )}
          <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>
            {board.emoji} {board.name}
          </h2>
        </div>
        <div className={styles.cardsArea} data-scan-scroll>
          <div className={styles.cardsGrid}>
            {/* 스캐닝 모드: 돌아가기 버튼 */}
            {isScanning && (
              <div
                className={useScanHighlight('card', 0) ? scanStyles.backBtnHighlight : scanStyles.backBtn}
                data-scan-phase="card"
                data-scan-index={0}
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>돌아가기</span>
              </div>
            )}

            {board.cards.map((card, i) => (
              <ScannableSituationCard
                key={card.id}
                index={i + 1}
                card={card}
                onSelect={handleCardSelect}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 상황판 목록
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-md)' }} data-scan-scroll>
      <div style={{
        padding: 'var(--spacing-md)', background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>상황별 어휘판</h2>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--spacing-md)', padding: 'var(--spacing-md)',
      }}>
        {SITUATION_IDS.map((id, i) => {
          const board = SITUATION_BOARDS[id];
          return (
            <ScannableSituationTile
              key={id}
              index={i}
              board={board}
              onClick={() => handleSituationClick(id)}
            />
          );
        })}
      </div>
    </div>
  );
}
