// ========================================
// Loading.tsx - Suspense 폴백 로딩 스피너
// ========================================

import styles from '../../styles/Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.container} aria-label="로딩 중" role="status">
      <div className={styles.spinner} />
      <span className={styles.text}>로딩 중...</span>
    </div>
  );
}
