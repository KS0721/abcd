import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { sanitizeText, isValidCardText } from '../../lib/sanitize';
import { getImageUrl } from '../../lib/arasaac';
import type { CategoryId } from '../../types';
import styles from '../../styles/Modal.module.css';

const ARASAAC_API = 'https://api.arasaac.org/v1/pictograms/ko/search';

interface PictogramResult {
  _id: number;
}

export default function EditCardModal() {
  const { isOpen, card, category } = useAppStore((s) => s.editCardModal);
  const closeEditCardModal = useAppStore((s) => s.closeEditCardModal);
  const updateUserCard = useAppStore((s) => s.updateUserCard);
  const deleteUserCard = useAppStore((s) => s.deleteUserCard);

  const [text, setText] = useState('');
  const [searchResults, setSearchResults] = useState<PictogramResult[]>([]);
  const [selectedPictogramId, setSelectedPictogramId] = useState<number | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 카드 데이터로 초기화
  useEffect(() => {
    if (isOpen && card) {
      setText(card.text);
      setSelectedPictogramId(card.pictogramId || null);
      setPhotoData(card.pictogramUrl || null);
      setShowSearch(false);
      setSearchResults([]);
    }
  }, [isOpen, card]);

  // 아이콘 검색
  useEffect(() => {
    if (!showSearch) return;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    const sanitized = sanitizeText(text);
    if (!sanitized) { setSearchResults([]); return; }

    searchTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`${ARASAAC_API}/${encodeURIComponent(sanitized)}`, {
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
  }, [text, showSearch]);

  const handleSave = useCallback(() => {
    if (!card || !category) return;
    const sanitized = sanitizeText(text);
    if (!isValidCardText(sanitized)) return;

    const updates: Record<string, unknown> = { text: sanitized, arasaacKeyword: sanitized };

    if (photoData && photoData !== card.pictogramUrl) {
      updates.pictogramUrl = photoData;
      updates.pictogramId = undefined;
    } else if (selectedPictogramId && selectedPictogramId !== card.pictogramId) {
      updates.pictogramId = selectedPictogramId;
      updates.pictogramUrl = undefined;
    }

    updateUserCard(category as CategoryId, card.id, updates as any);
    closeEditCardModal();
  }, [text, card, category, photoData, selectedPictogramId, updateUserCard, closeEditCardModal]);

  const handleDelete = useCallback(() => {
    if (!card || !category) return;
    deleteUserCard(category as CategoryId, card.id);
    closeEditCardModal();
  }, [card, category, deleteUserCard, closeEditCardModal]);

  const handlePhotoCapture = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
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
        setSelectedPictogramId(null);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }, []);

  if (!isOpen || !card) return null;

  return (
    <div className={styles.overlay} onClick={() => closeEditCardModal()}>
      <div className={styles.addCardModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.addCardHeader}>
          <h3>카드 수정</h3>
          <button className={styles.addCardClose} onClick={() => closeEditCardModal()} aria-label="닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.addCardBody}>
          <input
            className={styles.addCardInput}
            type="text"
            placeholder="카드 텍스트"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={50}
            autoFocus
          />

          {/* 아이콘 변경 옵션 */}
          <div className={styles.iconSection}>
            <div className={styles.iconSectionLabel}>아이콘 변경</div>
            <div className={styles.iconOptions}>
              <button
                className={`${styles.iconOption} ${showSearch ? styles.iconOptionActive : ''}`}
                onClick={() => setShowSearch(!showSearch)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                아이콘 검색
              </button>
              <button
                className={styles.iconOption}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                사진 변경
              </button>
            </div>

            {/* 검색 결과 */}
            {showSearch && (
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
                          onClick={() => { setSelectedPictogramId(p._id); setPhotoData(null); }}
                        >
                          <img src={url} alt="" loading="lazy" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* 사진 미리보기 */}
            {photoData && (
              <div className={styles.photoPreview}>
                <img src={photoData} alt="미리보기" />
              </div>
            )}

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
          <button
            onClick={handleDelete}
            style={{ background: '#DC2626', color: 'white' }}
          >
            삭제
          </button>
          <button
            onClick={handleSave}
            disabled={!isValidCardText(sanitizeText(text))}
            style={{ background: 'var(--color-primary)', color: 'white', opacity: isValidCardText(sanitizeText(text)) ? 1 : 0.5 }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
