import { useEffect, useRef, useCallback } from 'react';
import { useUIStore } from '../../store/useUIStore.ts';
import styles from '../../styles/Modal.module.css';

export default function ConfirmModal() {
  const { isOpen, message } = useUIStore((s) => s.confirmModal);
  const closeConfirm = useUIStore((s) => s.closeConfirm);
  const modalRef = useRef<HTMLDivElement>(null);

  // 포커스 트랩 + ESC 닫기
  useEffect(() => {
    if (!isOpen) return;

    // 열릴 때 첫 번째 버튼에 포커스
    const timer = setTimeout(() => {
      const firstBtn = modalRef.current?.querySelector('button');
      firstBtn?.focus();
    }, 50);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeConfirm(false); return; }

      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>('button, [tabindex]');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => { clearTimeout(timer); window.removeEventListener('keydown', handleKey); };
  }, [isOpen, closeConfirm]);

  const handleCancel = useCallback(() => closeConfirm(false), [closeConfirm]);
  const handleOk = useCallback(() => closeConfirm(true), [closeConfirm]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div
        ref={modalRef}
        className={styles.confirmModal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="확인"
      >
        <svg className={styles.confirmIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <p className={styles.confirmMessage}>{message}</p>
        <div className={styles.confirmButtons}>
          <button className={styles.confirmCancel} onClick={handleCancel}>취소</button>
          <button className={styles.confirmOk} onClick={handleOk}>확인</button>
        </div>
      </div>
    </div>
  );
}
