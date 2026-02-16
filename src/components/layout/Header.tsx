import { useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import styles from '../../styles/Header.module.css';

export default function Header() {
  const editMode = useAppStore((s) => s.editMode);
  const setEditMode = useAppStore((s) => s.setEditMode);
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  const toggleEdit = useCallback(() => {
    setEditMode(!editMode);
  }, [editMode, setEditMode]);

  const goToMenu = useCallback(() => {
    setCurrentView('menu');
  }, [setCurrentView]);

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={goToMenu}>
        <svg className={styles.logoIcon} viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.1)"/>
          <path d="M30 35 C30 25, 40 18, 60 18 C80 18, 90 25, 90 35 L90 60 C90 70, 80 77, 60 77 L45 77 L35 90 L38 77 C35 77, 30 70, 30 60 Z" fill="#D45A00"/>
          <path d="M60 58 C60 58, 48 48, 48 42 C48 36, 54 33, 60 40 C66 33, 72 36, 72 42 C72 48, 60 58, 60 58 Z" fill="white"/>
        </svg>
        <div className={styles.logoText}>올인원<span>AAC</span></div>
      </div>

      {editMode && <span className={`${styles.editBadge} ${styles.visible}`}>편집 모드</span>}

      <div className={styles.actions}>
        <button
          className={`${styles.headerBtn} ${editMode ? styles.editActive : ''}`}
          onClick={toggleEdit}
          aria-label={editMode ? '편집 완료' : '편집 모드'}
        >
          {editMode ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          )}
        </button>
      </div>
    </header>
  );
}
