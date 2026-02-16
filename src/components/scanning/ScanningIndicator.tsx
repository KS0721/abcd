import { useScanningStore } from '../../store/useScanningStore';
import styles from '../../styles/Scanning.module.css';

const PHASE_LABELS: Record<string, string> = {
  menu: '메뉴 선택',
  category: '카테고리 선택',
  card: '카드 선택',
  modal: '닫기 선택',
};

export default function ScanningIndicator() {
  const isActive = useScanningStore((s) => s.isActive);
  const phase = useScanningStore((s) => s.phase);

  if (!isActive) return null;

  const isCard = phase === 'card' || phase === 'modal';

  return (
    <div className={isCard ? styles.indicatorCard : styles.indicator}>
      {PHASE_LABELS[phase] || '스캐닝'}
    </div>
  );
}
