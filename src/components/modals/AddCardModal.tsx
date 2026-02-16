import { useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { sanitizeText, isValidCardText } from '../../lib/sanitize';
import styles from '../../styles/Modal.module.css';

export default function AddCardModal() {
  const { isOpen, category } = useAppStore((s) => s.addCardModal);
  const closeAddCardModal = useAppStore((s) => s.closeAddCardModal);
  const addUserCard = useAppStore((s) => s.addUserCard);
  const [text, setText] = useState('');

  const handleAdd = useCallback(() => {
    if (!category) return;
    const sanitized = sanitizeText(text);
    if (!isValidCardText(sanitized)) return;

    const card = {
      id: `user_${Date.now().toString(36)}`,
      text: sanitized,
      category,
      isUserCard: true,
      arasaacKeyword: sanitized,
    };

    addUserCard(category, card);
    setText('');
    closeAddCardModal();
  }, [text, category, addUserCard, closeAddCardModal]);

  const handleClose = useCallback(() => {
    setText('');
    closeAddCardModal();
  }, [closeAddCardModal]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.addCardModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.addCardHeader}>
          <h3>카드 추가</h3>
          <button className={styles.addCardClose} onClick={handleClose} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.addCardBody}>
          <input
            className={styles.addCardInput}
            type="text"
            placeholder="카드 텍스트를 입력하세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={50}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            autoFocus
          />
        </div>

        <div className={styles.addCardFooter}>
          <button onClick={handleClose} style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>
            취소
          </button>
          <button
            onClick={handleAdd}
            disabled={!isValidCardText(sanitizeText(text))}
            style={{ background: 'var(--color-primary)', color: 'white' }}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
