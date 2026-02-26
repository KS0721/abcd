// ========================================
// backup.ts - 로컬 백업/내보내기/가져오기
// 개인정보 없음 (설정 + 카드 데이터만 저장)
// ========================================

const BACKUP_VERSION = 1;
const APP_PREFIX = 'aac_';

// 백업에 포함할 localStorage 키 목록
const BACKUP_KEYS = [
  'aac_user_cards',
  'aac_card_order',
  'aac_quick_phrases',
  'aac_history',
  'aac_settings',
  'aac_speech_settings',
  'aac_scanning_settings',
] as const;

export interface BackupData {
  version: number;
  app: string;
  createdAt: string;
  data: Record<string, unknown>;
}

/** 현재 설정/카드 데이터를 JSON 객체로 수집 */
export function collectBackupData(): BackupData {
  const data: Record<string, unknown> = {};

  for (const key of BACKUP_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        data[key] = JSON.parse(raw);
      }
    } catch {
      // 파싱 실패 시 무시
    }
  }

  return {
    version: BACKUP_VERSION,
    app: 'allinone-aac',
    createdAt: new Date().toISOString(),
    data,
  };
}

/** JSON 파일로 다운로드 */
export function exportBackup(): void {
  const backup = collectBackupData();
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filename = `aac-backup-${date}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

/** 백업 파일 유효성 검사 */
function validateBackup(data: unknown): data is BackupData {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  if (obj.app !== 'allinone-aac') return false;
  if (typeof obj.version !== 'number') return false;
  if (!obj.data || typeof obj.data !== 'object') return false;

  // data 내 키가 모두 aac_ 접두사인지 확인
  const keys = Object.keys(obj.data as Record<string, unknown>);
  return keys.every((k) => k.startsWith(APP_PREFIX));
}

/** JSON 파일에서 복원 (Promise로 결과 반환) */
export function importBackup(file: File): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (!validateBackup(parsed)) {
          resolve({ success: false, message: '올바른 백업 파일이 아닙니다.' });
          return;
        }

        // localStorage에 복원
        const data = parsed.data as Record<string, unknown>;
        let count = 0;
        for (const [key, value] of Object.entries(data)) {
          if (key.startsWith(APP_PREFIX)) {
            localStorage.setItem(key, JSON.stringify(value));
            count++;
          }
        }

        resolve({
          success: true,
          message: `${count}개 항목이 복원되었습니다. 새로고침 후 적용됩니다.`,
        });
      } catch {
        resolve({ success: false, message: '파일을 읽을 수 없습니다.' });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, message: '파일을 읽을 수 없습니다.' });
    };

    reader.readAsText(file);
  });
}

/** 모든 사용자 데이터 초기화 */
export function resetAllData(): void {
  for (const key of BACKUP_KEYS) {
    localStorage.removeItem(key);
  }
}
