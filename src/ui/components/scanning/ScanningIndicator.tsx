import { useScanningStore } from '../../../domains/scanning/store/useScanningStore.ts';
import { useUIStore } from '../../store/useUIStore.ts';
import styles from '../../styles/Scanning.module.css';

const PHASE_LABELS: Record<string, string> = {
  category: '카테고리 선택',
  card: '카드 선택',
  modal: '화면 터치',
};

// TabBar의 TABS와 순서 일치: 말하기(0), 상황(1), 기록(2), 빠른 문장(3), 설정(4)
const SCREEN_NAMES = ['말하기', '상황', '기록', '빠른 문장', '설정'];

export default function ScanningIndicator() {
  const isActive = useScanningStore((s) => s.isActive);
  const phase = useScanningStore((s) => s.phase);
  const currentIndex = useScanningStore((s) => s.currentIndex);
  const currentSlide = useUIStore((s) => s.currentSlide);

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
