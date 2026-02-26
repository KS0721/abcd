import { useRef, useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useSpeechStore } from '../../store/useSpeechStore';
import { useScanningStore } from '../../store/useScanningStore';
import { useScanning } from '../../hooks/useScanning';
import { exportBackup, importBackup, resetAllData } from '../../lib/backup';
import { requestMicPermission } from '../../lib/adaptiveVolume';
import { useAppStore } from '../../store/useAppStore';
import type { Settings, GridSize, SpeechPreset } from '../../types';

export default function SettingsScreen() {
  const settings = useSettingsStore();
  const speech = useSpeechStore();
  const isScanActive = useScanningStore((s) => s.isActive);
  const { start: startScan, stop: stopScan } = useScanning();
  const sectionStyle: React.CSSProperties = {
    padding: 'var(--spacing-md)',
    background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
  };
  const titleStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)', fontWeight: 600,
    color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-sm)',
  };
  const rowStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: 'var(--spacing-sm) 0',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-base)', color: 'var(--color-text-primary)',
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{
        padding: 'var(--spacing-md)', background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>설정</h2>
      </div>

      {/* 표시 설정 */}
      <div style={sectionStyle}>
        <div style={titleStyle}>표시</div>

        <div style={rowStyle}>
          <span style={labelStyle}>다크 모드</span>
          <ToggleSwitch
            checked={settings.darkMode}
            onChange={(v) => settings.updateSetting('darkMode', v)}
          />
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>고대비 모드</span>
          <ToggleSwitch
            checked={settings.highContrast}
            onChange={(v) => settings.updateSetting('highContrast', v)}
          />
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>글자 크기</span>
          <select
            value={settings.fontSize}
            onChange={(e) => settings.updateSetting('fontSize', e.target.value as Settings['fontSize'])}
            style={{
              padding: '8px 12px', borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)', color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            <option value="medium">보통</option>
            <option value="large">크게</option>
            <option value="xlarge">아주 크게</option>
          </select>
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>진동</span>
          <ToggleSwitch
            checked={settings.vibration}
            onChange={(v) => settings.updateSetting('vibration', v)}
          />
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>카드 그리드</span>
          <select
            value={settings.gridSize}
            onChange={(e) => settings.updateSetting('gridSize', e.target.value as GridSize)}
            style={{
              padding: '8px 12px', borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)', color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            <option value="2x2">2x2 (아주 크게)</option>
            <option value="3x3">3x3 (크게)</option>
            <option value="4x4">4x4 (보통)</option>
            <option value="5x5">5x5 (작게)</option>
            <option value="6x6">6x6 (아주 작게)</option>
          </select>
        </div>

        <div style={{ padding: 'var(--spacing-sm) 0' }}>
          <label style={{ ...labelStyle, display: 'block', marginBottom: '4px' }}>
            카드 누르기 시간: {settings.dwellTime === 0 ? '즉시' : `${(settings.dwellTime / 1000).toFixed(1)}초`}
          </label>
          <input
            type="range" min="0" max="1000" step="100"
            value={settings.dwellTime}
            onChange={(e) => settings.updateSetting('dwellTime', parseInt(e.target.value, 10))}
            style={{ width: '100%' }}
          />
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            떨림이 있는 경우 길게 설정하면 오선택을 줄일 수 있습니다
          </div>
        </div>
      </div>

      {/* 소리 설정 */}
      <div style={sectionStyle}>
        <div style={titleStyle}>소리</div>

        <div style={rowStyle}>
          <span style={labelStyle}>카드 터치 시 읽기</span>
          <ToggleSwitch
            checked={speech.cardSpeak}
            onChange={(v) => speech.updateSpeechSetting('cardSpeak', v)}
          />
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>크게보기에서 반복</span>
          <ToggleSwitch
            checked={speech.repeatOnShow}
            onChange={(v) => speech.updateSpeechSetting('repeatOnShow', v)}
          />
        </div>

        <PresetRow
          label="말하기 속도"
          value={speech.rate}
          options={[
            { key: 'auto', label: '자동' },
            { key: 'small', label: '느리게' },
            { key: 'medium', label: '보통' },
            { key: 'large', label: '빠르게' },
          ]}
          onChange={(v) => speech.updateSpeechSetting('rate', v)}
          labelStyle={labelStyle}
        />

        <PresetRow
          label="음높이"
          value={speech.pitch}
          options={[
            { key: 'auto', label: '자동' },
            { key: 'small', label: '낮게' },
            { key: 'medium', label: '보통' },
            { key: 'large', label: '높게' },
          ]}
          onChange={(v) => speech.updateSpeechSetting('pitch', v)}
          labelStyle={labelStyle}
        />

        <PresetRow
          label="음량"
          value={speech.volume}
          options={[
            { key: 'auto', label: '자동' },
            { key: 'small', label: '작게' },
            { key: 'medium', label: '보통' },
            { key: 'large', label: '크게' },
          ]}
          onChange={async (v) => {
            if (v === 'auto') {
              const granted = await requestMicPermission();
              if (!granted) {
                alert('마이크 권한이 필요합니다. 브라우저 설정에서 허용해주세요.');
                return;
              }
            }
            speech.updateSpeechSetting('volume', v);
          }}
          labelStyle={labelStyle}
        />

        {speech.volume === 'auto' && (
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', padding: '0 0 var(--spacing-sm)' }}>
            주변 소음에 맞춰 음량이 자동 조절됩니다
          </div>
        )}
      </div>

      {/* 스캐닝 설정 */}
      <div style={sectionStyle}>
        <div style={titleStyle}>스캐닝</div>

        <div style={rowStyle}>
          <span style={labelStyle}>스캐닝 모드</span>
          <ToggleSwitch
            checked={isScanActive}
            onChange={(v) => v ? startScan() : stopScan()}
          />
        </div>

        <div style={{ padding: 'var(--spacing-sm) 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          자동 스캔 (3초 간격) · 터치 = 선택 · 꾹 = 끄기 · 두번터치 = 화면이동
        </div>
      </div>

      {/* 데이터 관리 */}
      <DataManagementSection sectionStyle={sectionStyle} titleStyle={titleStyle} />

      {/* 앱 정보 */}
      <div style={{ ...sectionStyle, textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <p style={{ fontSize: 'var(--font-size-sm)' }}>올인원 AAC v4.1</p>
        <p style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
          ARASAAC 픽토그램 (CC BY-NC-SA)
        </p>
      </div>
    </div>
  );
}

// 데이터 관리 섹션
function DataManagementSection({ sectionStyle, titleStyle }: {
  sectionStyle: React.CSSProperties;
  titleStyle: React.CSSProperties;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const showConfirm = useAppStore((s) => s.showConfirm);

  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '12px', borderRadius: '10px',
    border: '1px solid var(--color-border)', cursor: 'pointer',
    fontSize: 'var(--font-size-sm)', fontWeight: 500,
    background: 'var(--color-bg)', color: 'var(--color-text-primary)',
    marginBottom: '8px', textAlign: 'center' as const,
  };

  const handleExport = () => {
    exportBackup();
    setStatus({ type: 'success', msg: '백업 파일이 다운로드되었습니다.' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await importBackup(file);
    setStatus({ type: result.success ? 'success' : 'error', msg: result.message });

    if (result.success) {
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setTimeout(() => setStatus(null), 3000);
    }

    // 같은 파일 재선택 허용
    e.target.value = '';
  };

  const handleReset = async () => {
    const confirmed = await showConfirm(
      '모든 사용자 데이터(커스텀 카드, 설정, 빠른 문장)를 삭제합니다. 이 작업은 되돌릴 수 없습니다.'
    );
    if (!confirmed) return;

    resetAllData();
    setStatus({ type: 'success', msg: '초기화 완료. 새로고침합니다...' });
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div style={sectionStyle}>
      <div style={titleStyle}>데이터 관리</div>

      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
        설정, 커스텀 카드, 빠른 문장을 파일로 저장하거나 복원할 수 있습니다. 개인정보는 포함되지 않습니다.
      </p>

      <button style={btnStyle} onClick={handleExport}>
        내보내기 (백업 저장)
      </button>

      <button style={btnStyle} onClick={handleImportClick}>
        가져오기 (백업 복원)
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <button
        style={{ ...btnStyle, color: '#DC2626', borderColor: '#DC2626', marginTop: '8px' }}
        onClick={handleReset}
      >
        모든 데이터 초기화
      </button>

      {status && (
        <div style={{
          marginTop: '8px', padding: '10px', borderRadius: '8px',
          fontSize: 'var(--font-size-xs)', textAlign: 'center',
          background: status.type === 'success' ? '#DEF7EC' : '#FDE8E8',
          color: status.type === 'success' ? '#03543F' : '#9B1C1C',
        }}>
          {status.msg}
        </div>
      )}
    </div>
  );
}

// 프리셋 선택 버튼 행
function PresetRow({ label, value, options, onChange, labelStyle }: {
  label: string;
  value: SpeechPreset;
  options: { key: SpeechPreset; label: string }[];
  onChange: (v: SpeechPreset) => void;
  labelStyle: React.CSSProperties;
}) {
  return (
    <div style={{ padding: 'var(--spacing-sm) 0' }}>
      <div style={{ ...labelStyle, marginBottom: '6px' }}>{label}</div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {options.map((opt) => {
          const selected = value === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: '8px',
                border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: selected ? 'var(--color-primary)' : 'var(--color-bg)',
                color: selected ? 'white' : 'var(--color-text-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: selected ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 토글 스위치 컴포넌트
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: '52px', height: '28px', borderRadius: '14px',
        border: 'none', cursor: 'pointer', position: 'relative',
        background: checked ? 'var(--color-primary)' : 'var(--color-border)',
        transition: 'background var(--transition-fast)',
      }}
    >
      <span style={{
        position: 'absolute', top: '2px',
        left: checked ? '26px' : '2px',
        width: '24px', height: '24px', borderRadius: '50%',
        background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left var(--transition-fast)',
      }} />
    </button>
  );
}
