import { useCallback } from 'react';
import type { CategoryId } from '../../types';
import { DEFAULT_CATEGORIES, CATEGORY_ICONS } from '../../data/cards';
import { useAppStore } from '../../store/useAppStore';
import { useScanHighlight } from '../../hooks/useScanning';
import styles from '../../styles/CategoryBar.module.css';
import scanStyles from '../../styles/Scanning.module.css';

function CategoryTab({ index, cat, isActive, onClick }: {
  index: number;
  cat: { id: CategoryId; name: string };
  isActive: boolean;
  onClick: () => void;
}) {
  const highlighted = useScanHighlight('category', index);
  const classNames = [
    styles.tab,
    isActive && styles.active,
    highlighted && scanStyles.highlightTab,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      data-category={cat.id}
      data-scan-phase="category"
      data-scan-index={index}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={cat.name}
    >
      <span dangerouslySetInnerHTML={{ __html: CATEGORY_ICONS[cat.id] }} />
      {cat.name}
    </button>
  );
}

export default function CategoryBar() {
  const currentCategory = useAppStore((s) => s.currentCategory);
  const setCurrentCategory = useAppStore((s) => s.setCurrentCategory);

  const handleClick = useCallback((id: CategoryId) => {
    setCurrentCategory(id);
  }, [setCurrentCategory]);

  return (
    <div className={styles.bar} data-scan-scroll>
      {DEFAULT_CATEGORIES.map((cat, i) => (
        <CategoryTab
          key={cat.id}
          index={i}
          cat={cat}
          isActive={currentCategory === cat.id}
          onClick={() => handleClick(cat.id)}
        />
      ))}
    </div>
  );
}
