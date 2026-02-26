// ========================================
// 퀵프레이즈 서비스 - 빠른 문장 관리
// ========================================

import { safeStorage } from '../../../infrastructure/storage/safeStorage.ts';

const PHRASES_KEY = 'aac_quick_phrases';

export function loadQuickPhrases(defaults: string[]): string[] {
  return safeStorage.get<string[]>(PHRASES_KEY) || defaults;
}

export function addPhrase(phrases: string[], phrase: string): string[] {
  if (phrases.includes(phrase)) return phrases;
  const updated = [...phrases, phrase];
  safeStorage.set(PHRASES_KEY, updated);
  return updated;
}

export function removePhrase(phrases: string[], index: number): string[] {
  const updated = phrases.filter((_, i) => i !== index);
  safeStorage.set(PHRASES_KEY, updated);
  return updated;
}

export function updatePhrase(phrases: string[], index: number, newPhrase: string): string[] {
  const updated = phrases.map((p, i) => i === index ? newPhrase : p);
  safeStorage.set(PHRASES_KEY, updated);
  return updated;
}
