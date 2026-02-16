import { useCallback } from 'react';
import type { SlideIndex } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useScanHighlight } from '../../hooks/useScanning';
import styles from '../../styles/MainMenu.module.css';
import scanStyles from '../../styles/Scanning.module.css';

const MENU_ITEMS = [
  { slide: 0 as SlideIndex, label: '말하기', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
  { slide: 1 as SlideIndex, label: '상황', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { slide: 2 as SlideIndex, label: '기록', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
  { slide: 3 as SlideIndex, label: '설정', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
];

// 스캐닝은 말하기(0)와 상황(1)만 대상
const SCANNABLE_ITEMS = MENU_ITEMS.filter((_, i) => i < 2);

function MenuTile({ index, item, onClick }: {
  index: number;
  item: typeof MENU_ITEMS[number];
  onClick: () => void;
}) {
  const highlighted = useScanHighlight('menu', index);

  return (
    <button
      className={`${styles.tile} ${highlighted ? scanStyles.highlightTile : ''}`}
      onClick={onClick}
      data-scan-phase="menu"
      data-scan-index={index}
    >
      <span dangerouslySetInnerHTML={{ __html: item.icon }} />
      <span>{item.label}</span>
    </button>
  );
}

export default function MainMenu() {
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const setCurrentSlide = useAppStore((s) => s.setCurrentSlide);

  const handleClick = useCallback((slide: SlideIndex) => {
    setCurrentSlide(slide);
    setCurrentView('app');
  }, [setCurrentSlide, setCurrentView]);

  return (
    <div className={styles.menu}>
      <div className={styles.header}>
        <svg className={styles.logo} viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="55" fill="var(--color-primary-bg)"/>
          <path d="M30 35 C30 25, 40 18, 60 18 C80 18, 90 25, 90 35 L90 60 C90 70, 80 77, 60 77 L45 77 L35 90 L38 77 C35 77, 30 70, 30 60 Z" fill="var(--color-primary)"/>
          <path d="M60 58 C60 58, 48 48, 48 42 C48 36, 54 33, 60 40 C66 33, 72 36, 72 42 C72 48, 60 58, 60 58 Z" fill="white"/>
        </svg>
        <h1 className={styles.title}>올인원<span>AAC</span></h1>
      </div>

      <div className={styles.grid}>
        {MENU_ITEMS.map((item, i) => {
          // 스캐닝 대상은 말하기(0), 상황(1)만
          const scanIndex = i < SCANNABLE_ITEMS.length ? i : -1;
          return (
            <MenuTile
              key={item.slide}
              index={scanIndex}
              item={item}
              onClick={() => handleClick(item.slide)}
            />
          );
        })}
      </div>
    </div>
  );
}
