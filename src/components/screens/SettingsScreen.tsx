import { useSettingsStore } from '../../store/useSettingsStore';
import { useSpeechStore } from '../../store/useSpeechStore';
import { useScanningStore } from '../../store/useScanningStore';
import { useScanning } from '../../hooks/useScanning';
import type { Settings } from '../../types';

export default function SettingsScreen() {
  const settings = useSettingsStore();
  const speech = useSpeechStore();
  const scanConfig = useScanningStore((s) => s.config);
  const isScanActive = useScanningStore((s) => s.isActive);
  const updateScanConfig = useScanningStore((s) => s.updateConfig);
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

        <div style={{ padding: 'var(--spacing-sm) 0' }}>
          <label style={{ ...labelStyle, display: 'block', marginBottom: '4px' }}>
            말하기 속도: {speech.rate.toFixed(1)}
          </label>
          <input
            type="range" min="0.3" max="2.0" step="0.1"
            value={speech.rate}
            onChange={(e) => speech.updateSpeechSetting('rate', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ padding: 'var(--spacing-sm) 0' }}>
          <label style={{ ...labelStyle, display: 'block', marginBottom: '4px' }}>
            음높이: {speech.pitch.toFixed(1)}
          </label>
          <input
            type="range" min="0.5" max="2.0" step="0.1"
            value={speech.pitch}
            onChange={(e) => speech.updateSpeechSetting('pitch', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ padding: 'var(--spacing-sm) 0' }}>
          <label style={{ ...labelStyle, display: 'block', marginBottom: '4px' }}>
            음량: {speech.volume.toFixed(1)}
          </label>
          <input
            type="range" min="0" max="1.0" step="0.1"
            value={speech.volume}
            onChange={(e) => speech.updateSpeechSetting('volume', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
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

        <div style={rowStyle}>
          <span style={labelStyle}>스캔 방식</span>
          <select
            value={scanConfig.method}
            onChange={(e) => updateScanConfig('method', e.target.value as 'auto' | 'step')}
            style={{
              padding: '8px 12px', borderRadius: '8px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)', color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            <option value="auto">자동 (터치 = 선택)</option>
            <option value="step">단계별 (터치 = 다음, 길게 = 선택)</option>
          </select>
        </div>

        <div style={{ padding: 'var(--spacing-sm) 0' }}>
          <label style={{ ...labelStyle, display: 'block', marginBottom: '4px' }}>
            스캔 속도: {(scanConfig.speed / 1000).toFixed(1)}초
          </label>
          <input
            type="range" min="500" max="5000" step="250"
            value={scanConfig.speed}
            onChange={(e) => updateScanConfig('speed', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={rowStyle}>
          <span style={labelStyle}>하이라이트 색상</span>
          <input
            type="color"
            value={scanConfig.highlightColor}
            onChange={(e) => updateScanConfig('highlightColor', e.target.value)}
            style={{ width: '40px', height: '32px', border: 'none', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* 앱 정보 */}
      <div style={{ ...sectionStyle, textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <p style={{ fontSize: 'var(--font-size-sm)' }}>올인원 AAC v4.0</p>
        <p style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
          ARASAAC 픽토그램 (CC BY-NC-SA)
        </p>
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
