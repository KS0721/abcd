import { useCallback, useState } from 'react';
import type { CategoryId } from '../../../domains/card/models.ts';
import { DEFAULT_CATEGORIES, CATEGORY_ICONS } from '../../../domains/card/data/index.ts';
import { useCardStore } from '../../../domains/card/store/useCardStore.ts';
import { useUIStore } from '../../store/useUIStore.ts';
import { useScanHighlight } from '../../../domains/scanning/hooks/useScanning.ts';
import styles from '../../styles/CategoryBar.module.css';
import scanStyles from '../../styles/Scanning.module.css';

function CategoryTab({ index, catId, catName, icon, isActive, isCustom, onClick, onLongPress }: {
  index: number;
  catId: string;
  catName: string;
  icon?: string;
  isActive: boolean;
  isCustom?: boolean;
  onClick: () => void;
  onLongPress?: () => void;
}) {
  const highlighted = useScanHighlight('category', index);
  const classNames = [
    styles.tab,
    isActive && styles.active,
    isActive && isCustom && styles.activeCustom,
    highlighted && scanStyles.highlightTab,
  ].filter(Boolean).join(' ');

  const longPressRef = useCallback((node: HTMLButtonElement | null) => {
    if (!node || !onLongPress) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let didLong = false;

    const down = () => {
      didLong = false;
      timer = setTimeout(() => { didLong = true; onLongPress(); }, 800);
    };
    const up = (e: Event) => {
      if (timer) clearTimeout(timer);
      if (didLong) e.preventDefault();
    };

    node.addEventListener('pointerdown', down);
    node.addEventListener('pointerup', up);
    node.addEventListener('pointerleave', () => { if (timer) clearTimeout(timer); });

    return () => {
      node.removeEventListener('pointerdown', down);
      node.removeEventListener('pointerup', up);
    };
  }, [onLongPress]);

  return (
    <button
      ref={isCustom ? longPressRef : undefined}
      className={classNames}
      data-category={catId}
      data-scan-phase="category"
      data-scan-index={index}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={catName}
    >
      {icon ? (
        <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon }} />
      ) : (
        <span aria-hidden="true" style={{ fontSize: '14px' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <line x1="7" y1="7" x2="7.01" y2="7"/>
          </svg>
        </span>
      )}
      {catName}
    </button>
  );
}

export default function CategoryBar() {
  const currentCategory = useCardStore((s) => s.currentCategory);
  const setCurrentCategory = useCardStore((s) => s.setCurrentCategory);
  const userCategories = useCardStore((s) => s.userCategories);
  const addUserCategory = useCardStore((s) => s.addUserCategory);
  const removeUserCategory = useCardStore((s) => s.removeUserCategory);
  const showConfirm = useUIStore((s) => s.showConfirm);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const handleClick = useCallback((id: string) => {
    setCurrentCategory(id);
  }, [setCurrentCategory]);

  const handleAdd = useCallback(() => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    addUserCategory(trimmed);
    setNewName('');
    setIsAdding(false);
  }, [newName, addUserCategory]);

  const handleRemove = useCallback(async (id: string, name: string) => {
    const confirmed = await showConfirm(`'${name}' 카테고리를 삭제할까요?`);
    if (confirmed) removeUserCategory(id);
  }, [showConfirm, removeUserCategory]);

  return (
    <div data-no-swipe>
      <div className={styles.bar} data-scan-scroll>
        {DEFAULT_CATEGORIES.map((cat, i) => (
          <CategoryTab
            key={cat.id}
            index={i}
            catId={cat.id}
            catName={cat.name}
            icon={CATEGORY_ICONS[cat.id as CategoryId]}
            isActive={currentCategory === cat.id}
            onClick={() => handleClick(cat.id)}
          />
        ))}

        {userCategories.map((cat, i) => (
          <CategoryTab
            key={cat.id}
            index={DEFAULT_CATEGORIES.length + i}
            catId={cat.id}
            catName={cat.name}
            isActive={currentCategory === cat.id}
            isCustom
            onClick={() => handleClick(cat.id)}
            onLongPress={() => handleRemove(cat.id, cat.name)}
          />
        ))}

        {/* 카테고리 추가 버튼 */}
        <button
          className={styles.addBtn}
          onClick={() => setIsAdding(!isAdding)}
          aria-label="카테고리 추가"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* 카테고리 추가 입력 */}
      {isAdding && (
        <div className={styles.addRow}>
          <input
            className={styles.addInput}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="카테고리 이름"
            autoFocus
          />
          <button className={styles.addSaveBtn} onClick={handleAdd}>저장</button>
          <button className={styles.addCancelBtn} onClick={() => { setIsAdding(false); setNewName(''); }}>취소</button>
        </div>
      )}
    </div>
  );
}
