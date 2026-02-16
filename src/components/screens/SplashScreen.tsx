import { useEffect } from 'react';
import styles from '../../styles/SplashScreen.module.css';

interface Props {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={styles.splash}>
      <svg className={styles.logo} viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.1)"/>
        <path d="M30 35 C30 25, 40 18, 60 18 C80 18, 90 25, 90 35 L90 60 C90 70, 80 77, 60 77 L45 77 L35 90 L38 77 C35 77, 30 70, 30 60 Z" fill="white" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.15))"/>
        <path d="M60 58 C60 58, 48 48, 48 42 C48 36, 54 33, 60 40 C66 33, 72 36, 72 42 C72 48, 60 58, 60 58 Z" fill="#FF6B9D"/>
        <circle cx="85" cy="30" r="8" fill="rgba(255,255,255,0.6)"/>
        <circle cx="95" cy="45" r="5" fill="rgba(255,255,255,0.4)"/>
      </svg>
      <h1 className={styles.title}>올인원<span>AAC</span></h1>
      <p className={styles.subtitle}>의사소통을 위한 첫걸음</p>
      <div className={styles.loadingBar} />
      <span className={styles.version}>v4.0</span>
    </div>
  );
}
