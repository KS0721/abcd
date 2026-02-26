import { useState, useEffect, useRef, memo } from 'react';
import { getImageByKeyword, getImageById, getFallbackSvg } from '../../../infrastructure/arasaac/arasaac.ts';
import styles from '../../styles/AACCard.module.css';

interface Props {
  keyword?: string;
  pictogramId?: number;
  pictogramUrl?: string;
  category: string;
  text: string;
}

const CardPictogram = memo(function CardPictogram({
  keyword, pictogramId, pictogramUrl, category, text,
}: Props) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const failedUrls = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    // 1순위: 직접 URL (커스텀 이미지, data: URI 등)
    if (pictogramUrl) {
      setImgUrl(pictogramUrl);
      setLoading(false);
      return;
    }

    // 2순위: ARASAAC 픽토그램 ID 직접 지정
    if (pictogramId) {
      const url = getImageById(pictogramId);
      setImgUrl(url || getFallbackSvg(text, category));
      setLoading(false);
      return;
    }

    // 3순위: 키워드로 ARASAAC 검색
    if (keyword) {
      setLoading(true);
      getImageByKeyword(keyword).then((url) => {
        if (cancelled) return;
        // 이전에 실패한 URL이면 즉시 폴백 (Cabello & Bertola, 2018: 빠른 폴백이 사용성 향상)
        if (url && failedUrls.current.has(url)) {
          setImgUrl(getFallbackSvg(text, category));
        } else {
          setImgUrl(url || getFallbackSvg(text, category));
        }
        setLoading(false);
      });
      return () => { cancelled = true; };
    }

    // 4순위: 폴백 SVG
    setImgUrl(getFallbackSvg(text, category));
    setLoading(false);
  }, [keyword, pictogramId, pictogramUrl, text, category]);

  const handleError = () => {
    // 실패한 URL 기록 후 즉시 폴백 (불필요한 재시도 제거)
    if (imgUrl) failedUrls.current.add(imgUrl);
    setImgUrl(getFallbackSvg(text, category));
  };

  return (
    <div className={`${styles.pictogram} ${loading ? styles.loading : ''}`}>
      {imgUrl && (
        <img
          src={imgUrl}
          alt={text}
          loading="lazy"
          onError={handleError}
        />
      )}
    </div>
  );
});

export default CardPictogram;
