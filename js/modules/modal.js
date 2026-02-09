/* ========================================
   modal.js - 모달 관리
======================================== */

let confirmResolve = null;
let addCardCallback = null;
let currentCategory = null;
let getPictogramFunc = null;

// 픽토그램 함수 설정
export function setPictogramFunction(func) {
    getPictogramFunc = func;
}

// 청자 모달 열기 (픽토그램 포함)
export function showListenerModal(message, isEmergency = false, selectedCards = []) {
    const modal = document.getElementById('listenerModal');
    const textEl = document.getElementById('listenerText');
    const pictogramsEl = document.getElementById('listenerPictograms');
    
    if (!modal || !textEl) return;
    
    textEl.textContent = message;
    
    // 픽토그램 표시
    if (pictogramsEl && selectedCards.length > 0 && getPictogramFunc) {
        pictogramsEl.innerHTML = selectedCards.map(card => `
            <div class="listener-pictogram">
                ${getPictogramFunc(card.pictogram)}
            </div>
        `).join('');
    } else if (pictogramsEl) {
        pictogramsEl.innerHTML = '';
    }
    
    if (isEmergency) {
        modal.classList.add('emergency');
    } else {
        modal.classList.remove('emergency');
    }
    
    modal.classList.add('active');
}

// 청자 모달 닫기
export function closeListenerModal() {
    const modal = document.getElementById('listenerModal');
    if (modal) {
        modal.classList.remove('active', 'emergency');
    }
}

// 확인 모달 열기 (Promise 반환)
export function showConfirmModal(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmModal');
        const messageEl = document.getElementById('confirmMessage');
        
        if (!modal || !messageEl) {
            resolve(false);
            return;
        }
        
        messageEl.textContent = message;
        modal.classList.add('active');
        confirmResolve = resolve;
    });
}

// 확인 모달 닫기
export function closeConfirmModal(result = false) {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    if (confirmResolve) {
        confirmResolve(result);
        confirmResolve = null;
    }
}

// 카드 추가 모달 열기
export function showAddCardModal(category, callback) {
    const modal = document.getElementById('addCardModal');
    const textInput = document.getElementById('newCardText');
    
    if (!modal || !textInput) return;
    
    currentCategory = category;
    addCardCallback = callback;
    textInput.value = '';
    
    modal.classList.add('active');
    textInput.focus();
}

// 카드 추가 모달 닫기
export function closeAddCardModal() {
    const modal = document.getElementById('addCardModal');
    if (modal) {
        modal.classList.remove('active');
    }
    
    addCardCallback = null;
    currentCategory = null;
}

// 카드 추가 확인
export function confirmAddCard() {
    const textInput = document.getElementById('newCardText');
    
    if (!textInput || !addCardCallback) return;
    
    const text = textInput.value.trim();
    
    if (text) {
        const cardData = {
            id: 'user_' + Date.now(),
            text: text,
            pictogram: 'default',
            isUserCard: true
        };
        
        addCardCallback(cardData);
        closeAddCardModal();
    }
}

// 모달 배경 클릭으로 닫기
export function initModalBackdropClose() {
    // 확인 모달
    const confirmModal = document.getElementById('confirmModal');
    if (confirmModal) {
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                closeConfirmModal(false);
            }
        });
    }
    
    // 카드 추가 모달
    const addCardModal = document.getElementById('addCardModal');
    if (addCardModal) {
        addCardModal.addEventListener('click', (e) => {
            if (e.target === addCardModal) {
                closeAddCardModal();
            }
        });
    }
}