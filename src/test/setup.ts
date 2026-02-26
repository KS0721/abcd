// ========================================
// 테스트 환경 설정 - DOM / Storage / Speech mocks
// ========================================

import { vi } from 'vitest';

// localStorage mock
const storage: Record<string, string> = {};
const localStorageMock: Storage = {
  getItem: vi.fn((key: string) => storage[key] ?? null),
  setItem: vi.fn((key: string, value: string) => { storage[key] = value; }),
  removeItem: vi.fn((key: string) => { delete storage[key]; }),
  clear: vi.fn(() => { Object.keys(storage).forEach((k) => delete storage[k]); }),
  get length() { return Object.keys(storage).length; },
  key: vi.fn((i: number) => Object.keys(storage)[i] ?? null),
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// speechSynthesis mock
const speechSynthesisMock = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  getVoices: vi.fn(() => []),
  speaking: false,
  paused: false,
  pending: false,
  onvoiceschanged: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(() => true),
};
Object.defineProperty(globalThis, 'speechSynthesis', { value: speechSynthesisMock });

// SpeechSynthesisUtterance mock
class MockUtterance {
  text = '';
  lang = '';
  rate = 1;
  pitch = 1;
  volume = 1;
  voice = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
}
Object.defineProperty(globalThis, 'SpeechSynthesisUtterance', { value: MockUtterance });

// navigator.vibrate mock
Object.defineProperty(navigator, 'vibrate', { value: vi.fn(() => true), writable: true });

// URL.createObjectURL / revokeObjectURL mock
if (!globalThis.URL.createObjectURL) {
  globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
}
if (!globalThis.URL.revokeObjectURL) {
  globalThis.URL.revokeObjectURL = vi.fn();
}
