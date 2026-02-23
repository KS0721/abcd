import { useScanningStore } from '../../store/useScanningStore';
import { useAppStore } from '../../store/useAppStore';
import styles from '../../styles/Scanning.module.css';

const PHASE_LABELS: Record<string, string> = {
  category: '카테고리 선택',
  card: '카드 선택',
  modal: '화면 터치',
};

const SCREEN_NAMES = ['말하기', '상황', '기록', '설정'];

export default function ScanningIndicator() {
  const isActive = useScanningStore((s) => s.isActive);
  const phase = useScanningStore((s) => s.phase);
  const currentIndex = useScanningStore((s) => s.currentIndex);
  const currentSlide = useAppStore((s) => s.currentSlide);

  if (!isActive) return null;

  const isCard = phase === 'card' || phase === 'modal';

  // 스캔 불가 화면(기록/설정) 또는 대기 상태
  const isWaiting = currentIndex < 0;
  const label = isWaiting
    ? `${SCREEN_NAMES[currentSlide]} · 두번터치로 이동`
    : PHASE_LABELS[phase] || '스캐닝';

  return (
    <div className={isCard ? styles.indicatorCard : styles.indicator}>
      {label}
    </div>
  );
}
