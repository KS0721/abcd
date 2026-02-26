// ========================================
// localStorage 안전 접근 어댑터
//
// 웹: localStorage 사용
// 네이티브 (Capacitor): Capacitor Preferences 사용
// - 앱 재설치 시 데이터 유지 (iOS), 안정적 저장
// ========================================

import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const isNative = Capacitor.isNativePlatform();

export const safeStorage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: unknown): void {
    try {
      const json = JSON.stringify(value);
      localStorage.setItem(key, json);

      // 네이티브: Capacitor Preferences에도 동기화
      if (isNative) {
        Preferences.set({ key, value: json }).catch(() => {});
      }
    } catch {
      // 저장 실패 무시
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);

      if (isNative) {
        Preferences.remove({ key }).catch(() => {});
      }
    } catch {
      // 무시
    }
  },

  /** 네이티브 앱 시작 시: Preferences → localStorage 복원 */
  async restoreFromNative(keys: string[]): Promise<void> {
    if (!isNative) return;

    for (const key of keys) {
      try {
        const { value } = await Preferences.get({ key });
        if (value !== null && localStorage.getItem(key) === null) {
          localStorage.setItem(key, value);
        }
      } catch {
        // 무시
      }
    }
  },
};
