/* ========================================
   tts.js - 음성 출력 (Text-to-Speech)
   
   기능:
   - 한국어 음성 자동 선택 (로컬 우선)
   - 속도/높낮이/볼륨 설정
   - 카드별 개별 발화
   - 반복 재생 (크게보기 모달용)
   - Chrome 장문 발화 버그 우회
   - 음성 목록 동적 로드
======================================== */

let synth = null;
let currentUtterance = null;
let repeatTimer = null;
let repeatCount = 0;
let lastSpokenText = '';

// ========================================
// 초기화
// ========================================

export function initTTS() {
    if (!('speechSynthesis' in window)) {
        console.warn('⚠️ 이 브라우저는 TTS를 지원하지 않습니다');
        return false;
    }
    
    synth = window.speechSynthesis;
    
    // 음성 목록 로드 (Chrome은 비동기)
    if (synth.getVoices().length > 0) {
        logKoreanVoices();
    }
    synth.onvoiceschanged = () => logKoreanVoices();
    
    // Chrome 버그 우회: 15초 이상 발화시 멈추는 문제
    setInterval(() => {
        if (synth && synth.speaking && !synth.paused) {
            synth.pause();
            synth.resume();
        }
    }, 10000);
    
    console.log('✅ TTS 초기화 완료');
    return true;
}

function logKoreanVoices() {
    const korean = synth.getVoices().filter(v => v.lang.includes('ko'));
    if (korean.length > 0) {
        console.log('🔊 한국어 음성:', korean.map(v => v.name).join(', '));
    }
}

// ========================================
// 설정 관리
// ========================================

function getSettings() {
    try {
        const saved = localStorage.getItem('aac_speech_settings');
        if (saved) {
            const s = JSON.parse(saved);
            return {
                rate: clamp(s.rate || 0.9, 0.3, 2),
                pitch: clamp(s.pitch || 1, 0.5, 2),
                volume: clamp(s.volume ?? 1, 0, 1),
                voiceName: s.voiceName || '',
                cardSpeak: s.cardSpeak ?? true,
                repeatOnShow: s.repeatOnShow ?? true,
                repeatInterval: s.repeatInterval || 5000
            };
        }
    } catch (e) { /* 무시 */ }
    
    return { 
        rate: 0.9, pitch: 1, volume: 1,
        voiceName: '', cardSpeak: true,
        repeatOnShow: true, repeatInterval: 5000
    };
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// ========================================
// 한국어 음성 선택
// ========================================

function findBestKoreanVoice(preferredName) {
    if (!synth) return null;
    const voices = synth.getVoices();
    
    // 사용자 지정
    if (preferredName) {
        const pref = voices.find(v => v.name === preferredName);
        if (pref) return pref;
    }
    
    const korean = voices.filter(v => v.lang.includes('ko'));
    if (korean.length === 0) return null;
    
    // 로컬 음성 우선 (빠름)
    return korean.find(v => v.localService) 
        || korean.find(v => v.name.includes('Google'))
        || korean[0];
}

export function getKoreanVoices() {
    if (!synth) return [];
    return synth.getVoices().filter(v => v.lang.includes('ko'));
}

// ========================================
// 발화
// ========================================

export function speak(text, options = {}) {
    if (!synth || !text) return false;
    
    stopSpeaking();
    stopRepeat();
    
    const settings = getSettings();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voice = findBestKoreanVoice(settings.voiceName);
    if (voice) utterance.voice = voice;
    
    utterance.lang = 'ko-KR';
    utterance.rate = options.rate ?? settings.rate;
    utterance.pitch = options.pitch ?? settings.pitch;
    utterance.volume = options.volume ?? settings.volume;
    
    utterance.onstart = () => {
        document.dispatchEvent(new CustomEvent('tts:start', { detail: { text } }));
    };
    utterance.onend = () => {
        currentUtterance = null;
        document.dispatchEvent(new CustomEvent('tts:end', { detail: { text } }));
    };
    utterance.onerror = (e) => {
        if (e.error !== 'interrupted') console.error('TTS 오류:', e.error);
        currentUtterance = null;
    };
    
    currentUtterance = utterance;
    lastSpokenText = text;
    synth.speak(utterance);
    return true;
}

// 카드 클릭시 개별 단어 발화 (짧고 약간 빠르게)
export function speakCard(text) {
    const settings = getSettings();
    if (!settings.cardSpeak) return false;
    return speak(text, {
        rate: Math.min(settings.rate + 0.15, 1.3),
        volume: settings.volume * 0.85
    });
}

// ========================================
// 반복 재생 (크게보기 모달용)
// ========================================

export function startRepeat(text, options = {}) {
    stopRepeat();
    const settings = getSettings();
    if (!settings.repeatOnShow && !options.force) return;
    
    const interval = options.interval || settings.repeatInterval;
    const maxRepeats = options.maxRepeats || 3;
    
    repeatCount = 0;
    speak(text, options);
    
    repeatTimer = setInterval(() => {
        repeatCount++;
        if (repeatCount >= maxRepeats) { stopRepeat(); return; }
        speak(text, options);
    }, interval);
}

export function stopRepeat() {
    if (repeatTimer) { clearInterval(repeatTimer); repeatTimer = null; }
    repeatCount = 0;
}

// ========================================
// 제어
// ========================================

export function stopSpeaking() {
    if (synth) { synth.cancel(); currentUtterance = null; }
}

export function isSpeaking() {
    return synth ? synth.speaking : false;
}

export function getVoices() {
    return synth ? synth.getVoices() : [];
}

export function repeatLast() {
    if (lastSpokenText) { speak(lastSpokenText); return true; }
    return false;
}
