import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { sanitizeText, isValidCardText } from '../../lib/sanitize';
import { getImageUrl } from '../../lib/arasaac';
import { normalizeKeyword } from '../../lib/grammar';
import styles from '../../styles/Modal.module.css';

const ARASAAC_API = 'https://api.arasaac.org/v1/pictograms/ko/search';

interface PictogramResult {
  _id: number;
  keywords: { keyword: string }[];
}

type IconSource = 'auto' | 'search' | 'photo';

export default function AddCardModal() {
  const { isOpen, category } = useAppStore((s) => s.addCardModal);
  const closeAddCardModal = useAppStore((s) => s.closeAddCardModal);
  const addUserCard = useAppStore((s) => s.addUserCard);

  const [text, setText] = useState('');
  const [iconSource, setIconSource] = useState<IconSource>('auto');
  const [searchResults, setSearchResults] = useState<PictogramResult[]>([]);
  const [selectedPictogramId, setSelectedPictogramId] = useState<number | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 텍스트 변경 시 자동 검색 (auto 모드)
  useEffect(() => {
    if (iconSource !== 'search') return;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    const sanitized = sanitizeText(text);
    if (!sanitized || sanitized.length < 1) {
      setSearchResults([]);
      return;
    }

    searchTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      const searchKeyword = normalizeKeyword(sanitized);
      try {
        const res = await fetch(`${ARASAAC_API}/${encodeURIComponent(searchKeyword)}`, {
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(Array.isArray(data) ? data.slice(0, 12) : []);
        }
      } catch { /* 무시 */ }
      setIsSearching(false);
    }, 500);

    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
  }, [text, iconSource]);

  const handleAdd = useCallback(() => {
    if (!category) return;
    const sanitized = sanitizeText(text);
    if (!isValidCardText(sanitized)) return;

    const card: Record<string, unknown> = {
      id: `user_${Date.now().toString(36)}`,
      text: sanitized,
      category,
      isUserCard: true,
    };

    if (photoData) {
      card.pictogramUrl = photoData;
    } else if (selectedPictogramId) {
      card.pictogramId = selectedPictogramId;
    } else {
      card.arasaacKeyword = normalizeKeyword(sanitized);
    }

    addUserCard(category, card as any);
    resetForm();
    closeAddCardModal();
  }, [text, category, photoData, selectedPictogramId, addUserCard, closeAddCardModal]);

  const handleClose = useCallback(() => {
    resetForm();
    closeAddCardModal();
  }, [closeAddCardModal]);

  const resetForm = () => {
    setText('');
    setIconSource('auto');
    setSearchResults([]);
    setSelectedPictogramId(null);
    setPhotoData(null);
  };

  const handlePhotoCapture = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      // 리사이즈
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        const scale = Math.min(size / img.width, size / img.height);
        const x = (size - img.width * scale) / 2;
        const y = (size - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        setPhotoData(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }, []);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.addCardModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.addCardHeader}>
          <h3>카드 추가</h3>
          <button className={styles.addCardClose} onClick={handleClose} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.addCardBody}>
          <input
            className={styles.addCardInput}
            type="text"
            placeholder="카드 텍스트를 입력하세요"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={50}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            autoFocus
          />

          {/* 아이콘 소스 선택 */}
          <div className={styles.iconSection}>
            <div className={styles.iconSectionLabel}>아이콘 선택</div>
            <div className={styles.iconOptions}>
              <button
                className={`${styles.iconOption} ${iconSource === 'auto' ? styles.iconOptionActive : ''}`}
                onClick={() => { setIconSource('auto'); setSelectedPictogramId(null); setPhotoData(null); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l4 2"/>
                </svg>
                자동
              </button>
              <button
                className={`${styles.iconOption} ${iconSource === 'search' ? styles.iconOptionActive : ''}`}
                onClick={() => { setIconSource('search'); setPhotoData(null); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                검색
              </button>
              <button
                className={`${styles.iconOption} ${iconSource === 'photo' ? styles.iconOptionActive : ''}`}
                onClick={() => { setIconSource('photo'); setSelectedPictogramId(null); fileInputRef.current?.click(); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                사진
              </button>
            </div>

            {/* 아이콘 검색 결과 */}
            {iconSource === 'search' && (
              <>
                {isSearching && <div className={styles.iconLoading}>검색 중...</div>}
                {!isSearching && searchResults.length > 0 && (
                  <div className={styles.iconGrid}>
                    {searchResults.map((p) => {
                      const url = getImageUrl(p._id, 300);
                      if (!url) return null;
                      return (
                        <div
                          key={p._id}
                          className={`${styles.iconGridItem} ${selectedPictogramId === p._id ? styles.iconGridItemSelected : ''}`}
                          onClick={() => setSelectedPictogramId(p._id)}
                        >
                          <img src={url} alt="" loading="lazy" />
                        </div>
                      );
                    })}
                  </div>
                )}
                {!isSearching && searchResults.length === 0 && text.length > 0 && (
                  <div className={styles.iconLoading}>텍스트를 입력하면 아이콘을 검색합니다</div>
                )}
              </>
            )}

            {/* 사진 미리보기 */}
            {photoData && (
              <div className={styles.photoPreview}>
                <img src={photoData} alt="미리보기" />
              </div>
            )}

            {/* 숨겨진 파일 입력 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className={styles.addCardFooter}>
          <button onClick={handleClose} style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}>
            취소
          </button>
          <button
            onClick={handleAdd}
            disabled={!isValidCardText(sanitizeText(text))}
            style={{ background: 'var(--color-primary)', color: 'white', opacity: isValidCardText(sanitizeText(text)) ? 1 : 0.5 }}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
