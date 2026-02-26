// ========================================
// 히스토리 서비스 - 발화 이력 관리
// ========================================

import { safeStorage } from '../../../infrastructure/storage/safeStorage.ts';
import { recordPhraseUsage } from './usageStatsService.ts';

const HISTORY_KEY = 'aac_history';
const MAX_HISTORY = 100;

export function loadHistory(): string[] {
  return safeStorage.get<string[]>(HISTORY_KEY) || [];
}

export function addToHistoryList(history: string[], message: string): string[] {
  if (history.length > 0 && history[0] === message) return history;
  const updated = [message, ...history].slice(0, MAX_HISTORY);
  safeStorage.set(HISTORY_KEY, updated);
  recordPhraseUsage(message);
  return updated;
}

export function clearHistoryStorage(): void {
  safeStorage.remove(HISTORY_KEY);
}
