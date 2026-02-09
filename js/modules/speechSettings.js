/**
 * speechSettings.js - 음성 설정 UI 모듈
 * 
 * 설정 항목:
 * - 음성 속도 (0.5 ~ 1.5)
 * - 음성 높낮이 (0.5 ~ 1.5)
 * - 음성 볼륨 (0.5 ~ 1)
 * - 한국어 음성 선택 (기기에 따라 다름)
 * - 카드 클릭시 개별 발화 on/off
 * - 크게보기 반복 재생 on/off
 */

import { speak, getKoreanVoices } from './tts.js';

const SpeechSettingsModule = {
    rate: 0.9,
    pitch: 1,
    volume: 1,
    voiceName: '',
    cardSpeak: true,
    repeatOnShow: true,
    repeatInterval: 5000,
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.applySettings();
        this.populateVoiceSelect();
        
        // Chrome에서 음성 목록이 늦게 로드될 수 있음
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = () => {
                this.populateVoiceSelect();
            };
        }
    },
    
    loadSettings() {
        try {
            const saved = localStorage.getItem('aac_speech_settings');
            if (saved) {
                const s = JSON.parse(saved);
                this.rate = s.rate || 0.9;
                this.pitch = s.pitch || 1;
                this.volume = s.volume ?? 1;
                this.voiceName = s.voiceName || '';
                this.cardSpeak = s.cardSpeak ?? true;
                this.repeatOnShow = s.repeatOnShow ?? true;
                this.repeatInterval = s.repeatInterval || 5000;
            }
        } catch (e) { /* 무시 */ }
    },
    
    saveSettings() {
        localStorage.setItem('aac_speech_settings', JSON.stringify({
            rate: this.rate,
            pitch: this.pitch,
            volume: this.volume,
            voiceName: this.voiceName,
            cardSpeak: this.cardSpeak,
            repeatOnShow: this.repeatOnShow,
            repeatInterval: this.repeatInterval
        }));
    },
    
    setupEventListeners() {
        // 속도
        this.bindSelect('speechRateSelect', 'rate', parseFloat, true);
        // 높낮이
        this.bindSelect('speechPitchSelect', 'pitch', parseFloat, true);
        // 볼륨
        this.bindSelect('speechVolumeSelect', 'volume', parseFloat, false);
        // 음성 선택
        this.bindSelect('speechVoiceSelect', 'voiceName', String, true);
        // 카드 개별 발화
        this.bindToggle('cardSpeakToggle', 'cardSpeak');
        // 반복 재생
        this.bindToggle('repeatOnShowToggle', 'repeatOnShow');
    },
    
    bindSelect(id, prop, parser, testAfter) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', (e) => {
            this[prop] = parser(e.target.value);
            this.saveSettings();
            if (testAfter) this.testSpeak();
        });
    },
    
    bindToggle(id, prop) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', (e) => {
            this[prop] = e.target.checked;
            this.saveSettings();
        });
    },
    
    applySettings() {
        this.setSelectValue('speechRateSelect', this.rate);
        this.setSelectValue('speechPitchSelect', this.pitch);
        this.setSelectValue('speechVolumeSelect', this.volume);
        this.setSelectValue('speechVoiceSelect', this.voiceName);
        this.setToggleValue('cardSpeakToggle', this.cardSpeak);
        this.setToggleValue('repeatOnShowToggle', this.repeatOnShow);
    },
    
    setSelectValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value;
    },
    
    setToggleValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.checked = value;
    },
    
    // 한국어 음성 목록 채우기
    populateVoiceSelect() {
        const select = document.getElementById('speechVoiceSelect');
        if (!select) return;
        
        const voices = getKoreanVoices();
        
        select.innerHTML = '<option value="">자동 선택</option>';
        voices.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.name;
            opt.textContent = v.name + (v.localService ? ' (로컬)' : ' (온라인)');
            if (v.name === this.voiceName) opt.selected = true;
            select.appendChild(opt);
        });
    },
    
    testSpeak() {
        speak('안녕하세요');
    },
    
    getSettings() {
        return {
            rate: this.rate,
            pitch: this.pitch,
            volume: this.volume,
            voiceName: this.voiceName,
            cardSpeak: this.cardSpeak,
            repeatOnShow: this.repeatOnShow,
            repeatInterval: this.repeatInterval
        };
    }
};

export default SpeechSettingsModule;
