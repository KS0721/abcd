import { useState, useEffect, memo } from 'react';
import { getImageByKeyword, getImageById, getFallbackSvg } from '../../lib/arasaac';
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
        setImgUrl(url || getFallbackSvg(text, category));
        setLoading(false);
      });
      return () => { cancelled = true; };
    }

    // 4순위: 폴백 SVG
    setImgUrl(getFallbackSvg(text, category));
    setLoading(false);
  }, [keyword, pictogramId, pictogramUrl, text, category]);

  return (
    <div className={`${styles.pictogram} ${loading ? styles.loading : ''}`}>
      {imgUrl && (
        <img
          src={imgUrl}
          alt={text}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getFallbackSvg(text, category);
          }}
        />
      )}
    </div>
  );
});

export default CardPictogram;
