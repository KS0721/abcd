import { useCallback } from 'react';
import { useCardStore } from '../../../domains/card/store/useCardStore.ts';
import { useSettingsStore } from '../../store/useSettingsStore.ts';
import { useUIStore } from '../../store/useUIStore.ts';
import styles from '../../styles/Header.module.css';

export default function Header() {
  const editMode = useCardStore((s) => s.editMode);
  const setEditMode = useCardStore((s) => s.setEditMode);
  const sttEnabled = useSettingsStore((s) => s.sttEnabled);
  const sttPanelOpen = useUIStore((s) => s.sttPanelOpen);
  const toggleSTTPanel = useUIStore((s) => s.toggleSTTPanel);

  const toggleEdit = useCallback(() => {
    setEditMode(!editMode);
  }, [editMode, setEditMode]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <svg className={styles.logoIcon} viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.1)"/>
          <path d="M30 35 C30 25, 40 18, 60 18 C80 18, 90 25, 90 35 L90 60 C90 70, 80 77, 60 77 L45 77 L35 90 L38 77 C35 77, 30 70, 30 60 Z" fill="#D45A00"/>
          <path d="M60 58 C60 58, 48 48, 48 42 C48 36, 54 33, 60 40 C66 33, 72 36, 72 42 C72 48, 60 58, 60 58 Z" fill="white"/>
        </svg>
        <div className={styles.logoText}>올인원<span>AAC</span></div>
      </div>

      {editMode && <span className={`${styles.editBadge} ${styles.visible}`}>편집 모드</span>}

      <div className={styles.actions}>
        {/* 상대방 듣기 (STT) 버튼 — 설정에서 켜야 표시 */}
        {sttEnabled && (
          <button
            className={`${styles.headerBtn} ${sttPanelOpen ? styles.editActive : ''}`}
            onClick={toggleSTTPanel}
            aria-label={sttPanelOpen ? '듣기 닫기' : '상대방 듣기'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
        )}

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
