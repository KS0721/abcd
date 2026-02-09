/**
 * photoCards.js - 사진 카드 개인화 기능
 * 박은혜 외(2016) 권장: 사용자 맞춤 어휘 지원
 */

const PhotoCardsModule = {
    // 저장된 커스텀 카드
    customCards: [],
    currentPhotoData: null,
    
    // 초기화
    init() {
        this.loadCustomCards();
        this.setupEventListeners();
        this.renderCustomCardsList();
    },
    
    // 커스텀 카드 로드
    loadCustomCards() {
        const saved = localStorage.getItem('aac_custom_cards');
        if (saved) {
            this.customCards = JSON.parse(saved);
        }
    },
    
    // 커스텀 카드 저장
    saveCustomCards() {
        localStorage.setItem('aac_custom_cards', JSON.stringify(this.customCards));
    },
    
    // 이벤트 리스너 설정
    setupEventListeners() {
        // 사진 업로드 버튼
        const uploadBtn = document.getElementById('photoUploadBtn');
        const uploadInput = document.getElementById('photoUpload');
        
        if (uploadBtn && uploadInput) {
            uploadBtn.addEventListener('click', () => {
                uploadInput.click();
            });
            
            uploadInput.addEventListener('change', (e) => {
                this.handlePhotoSelect(e);
            });
        }
        
        // 카드 저장 버튼
        const saveBtn = document.getElementById('savePhotoCard');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveNewCard();
            });
        }
    },
    
    // 사진 선택 처리
    handlePhotoSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // 파일 크기 체크 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            alert('사진 크기는 5MB 이하여야 합니다.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentPhotoData = e.target.result;
            this.showPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    },
    
    // 사진 미리보기 표시
    showPhotoPreview(dataUrl) {
        const preview = document.getElementById('photoPreview');
        const nameInput = document.getElementById('photoCardName');
        const categorySelect = document.getElementById('photoCardCategory');
        const saveBtn = document.getElementById('savePhotoCard');
        
        if (preview) {
            preview.innerHTML = `<img src="${dataUrl}" alt="미리보기">`;
            preview.style.display = 'block';
        }
        
        if (nameInput) {
            nameInput.style.display = 'block';
            nameInput.focus();
        }
        
        if (categorySelect) {
            categorySelect.style.display = 'block';
        }
        
        if (saveBtn) {
            saveBtn.style.display = 'block';
        }
    },
    
    // 새 카드 저장
    saveNewCard() {
        const nameInput = document.getElementById('photoCardName');
        const categorySelect = document.getElementById('photoCardCategory');
        
        if (!this.currentPhotoData) {
            alert('사진을 먼저 선택해주세요.');
            return;
        }
        
        const name = nameInput?.value.trim();
        if (!name) {
            alert('카드 이름을 입력해주세요.');
            nameInput?.focus();
            return;
        }
        
        const category = categorySelect?.value || 'thing';
        
        // 새 카드 생성
        const newCard = {
            id: 'custom_' + Date.now(),
            text: name,
            category: category,
            photoData: this.currentPhotoData,
            createdAt: new Date().toISOString()
        };
        
        this.customCards.push(newCard);
        this.saveCustomCards();
        
        // UI 초기화
        this.resetUploadUI();
        
        // 카드 목록 업데이트
        this.renderCustomCardsList();
        
        // 앱에 카드 추가 알림
        this.notifyCardAdded(newCard);
        
        alert(`"${name}" 카드가 추가되었습니다!`);
    },
    
    // 업로드 UI 초기화
    resetUploadUI() {
        const preview = document.getElementById('photoPreview');
        const nameInput = document.getElementById('photoCardName');
        const categorySelect = document.getElementById('photoCardCategory');
        const saveBtn = document.getElementById('savePhotoCard');
        const uploadInput = document.getElementById('photoUpload');
        
        this.currentPhotoData = null;
        
        if (preview) {
            preview.innerHTML = '';
            preview.style.display = 'none';
        }
        if (nameInput) {
            nameInput.value = '';
            nameInput.style.display = 'none';
        }
        if (categorySelect) {
            categorySelect.style.display = 'none';
        }
        if (saveBtn) {
            saveBtn.style.display = 'none';
        }
        if (uploadInput) {
            uploadInput.value = '';
        }
    },
    
    // 커스텀 카드 목록 렌더링
    renderCustomCardsList() {
        const container = document.getElementById('customCardsList');
        if (!container) return;
        
        if (this.customCards.length === 0) {
            container.innerHTML = '<p style="color: var(--color-text-muted); font-size: 14px;">저장된 사진 카드가 없습니다.</p>';
            return;
        }
        
        container.innerHTML = `
            <p style="font-weight: 600; margin-bottom: 8px;">내 카드 (${this.customCards.length}개)</p>
            ${this.customCards.map(card => `
                <div class="custom-card-item" data-id="${card.id}">
                    <img src="${card.photoData}" alt="${card.text}">
                    <span>${card.text}</span>
                    <button onclick="PhotoCardsModule.deleteCard('${card.id}')">삭제</button>
                </div>
            `).join('')}
        `;
    },
    
    // 카드 삭제
    deleteCard(cardId) {
        if (!confirm('이 카드를 삭제하시겠습니까?')) return;
        
        this.customCards = this.customCards.filter(c => c.id !== cardId);
        this.saveCustomCards();
        this.renderCustomCardsList();
        
        // 앱에 카드 삭제 알림
        this.notifyCardDeleted(cardId);
    },
    
    // 카드 추가 알림 (앱에 통합)
    notifyCardAdded(card) {
        // 커스텀 이벤트 발생
        const event = new CustomEvent('customCardAdded', { detail: card });
        document.dispatchEvent(event);
    },
    
    // 카드 삭제 알림
    notifyCardDeleted(cardId) {
        const event = new CustomEvent('customCardDeleted', { detail: { id: cardId } });
        document.dispatchEvent(event);
    },
    
    // 커스텀 카드 가져오기
    getCustomCards() {
        return this.customCards;
    },
    
    // 카드를 DOM 요소로 변환
    createCardElement(card) {
        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.id = card.id;
        div.dataset.text = card.text;
        div.dataset.category = card.category;
        div.dataset.custom = 'true';
        
        div.innerHTML = `
            <div class="card-image" style="background-image: url(${card.photoData}); background-size: cover; background-position: center;"></div>
            <span class="card-text">${card.text}</span>
        `;
        
        return div;
    }
};

// 전역으로 노출 (삭제 버튼용)
window.PhotoCardsModule = PhotoCardsModule;

export default PhotoCardsModule;
