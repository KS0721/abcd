import { describe, it, expect, beforeEach } from 'vitest';
import { collectBackupData, resetAllData } from '../backupService.ts';

beforeEach(() => {
  localStorage.clear();
});

describe('collectBackupData', () => {
  it('올바른 백업 구조 반환', () => {
    localStorage.setItem('aac_settings', JSON.stringify({ darkMode: false }));
    const backup = collectBackupData();
    expect(backup.app).toBe('allinone-aac');
    expect(backup.version).toBe(1);
    expect(backup.createdAt).toBeTruthy();
    expect(backup.data).toHaveProperty('aac_settings');
  });

  it('빈 localStorage면 빈 data 반환', () => {
    const backup = collectBackupData();
    expect(Object.keys(backup.data)).toHaveLength(0);
  });

  it('aac_ 접두사 키만 수집', () => {
    localStorage.setItem('aac_history', JSON.stringify([]));
    localStorage.setItem('other_key', 'value');
    const backup = collectBackupData();
    expect(backup.data).toHaveProperty('aac_history');
    expect(backup.data).not.toHaveProperty('other_key');
  });
});

describe('resetAllData', () => {
  it('모든 aac_ 키 삭제', () => {
    localStorage.setItem('aac_settings', JSON.stringify({}));
    localStorage.setItem('aac_history', JSON.stringify([]));
    localStorage.setItem('other_key', 'keep');
    resetAllData();
    expect(localStorage.getItem('aac_settings')).toBeNull();
    expect(localStorage.getItem('aac_history')).toBeNull();
    expect(localStorage.getItem('other_key')).toBe('keep');
  });
});
