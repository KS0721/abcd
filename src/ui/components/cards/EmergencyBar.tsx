import { useCallback } from 'react';
import { EMERGENCY_CARDS } from '../../../domains/card/data/index.ts';
import { useSentenceStore } from '../../../domains/sentence/store/useSentenceStore.ts';
import { useUIStore } from '../../store/useUIStore.ts';
import styles from '../../styles/EmergencyBar.module.css';

export default function EmergencyBar() {
  const selectCard = useSentenceStore((s) => s.selectCard);
  const openListenerModal = useUIStore((s) => s.openListenerModal);

  const handleClick = useCallback((card: typeof EMERGENCY_CARDS[0]) => {
    // 긴급 햅틱: 두 번 강하게
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    selectCard(card);
    openListenerModal(card.text, true, [card]);
  }, [selectCard, openListenerModal]);

  return (
    <div className={styles.bar} data-no-swipe>
      <div className={styles.label}>
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        긴급
      </div>
      <div className={styles.chips}>
        {EMERGENCY_CARDS.map((card) => (
          <button
            key={card.id}
            className={styles.chip}
            onClick={() => handleClick(card)}
            aria-label={card.text}
          >
            {card.text}
          </button>
        ))}
      </div>
    </div>
  );
}
