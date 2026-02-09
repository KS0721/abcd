/* ========================================
   drag-drop.js - 드래그 앤 드롭 (개선)
======================================== */

import { vibrate } from '../utils/helpers.js';

let dragState = {
    isDragging: false,
    draggedEl: null,
    placeholder: null,
    startIndex: -1,
    currentIndex: -1,
    container: null,
    options: null,
    clone: null,
    offsetX: 0,
    offsetY: 0
};

// 드래그 앤 드롭 초기화
export function initDragDrop(container, options = {}) {
    const defaults = {
        itemSelector: '.card',
        handleSelector: '.card-drag-handle',
        enabled: () => true,
        onReorder: () => {},
        longPressDuration: 400
    };
    
    const config = { ...defaults, ...options };
    
    const items = container.querySelectorAll(config.itemSelector);
    
    items.forEach((item, index) => {
        let longPressTimer = null;
        let touchStartPos = { x: 0, y: 0 };
        let isLongPress = false;
        
        // 터치 시작
        item.addEventListener('touchstart', (e) => {
            if (!config.enabled()) return;
            
            touchStartPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            isLongPress = false;
            
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                vibrate(50);
                startDrag(item, index, container, config, e.touches[0]);
            }, config.longPressDuration);
        }, { passive: true });
        
        // 터치 이동
        item.addEventListener('touchmove', (e) => {
            if (longPressTimer && !isLongPress) {
                const moveX = Math.abs(e.touches[0].clientX - touchStartPos.x);
                const moveY = Math.abs(e.touches[0].clientY - touchStartPos.y);
                
                if (moveX > 10 || moveY > 10) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
            }
            
            if (dragState.isDragging) {
                e.preventDefault();
                handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: false });
        
        // 터치 종료
        item.addEventListener('touchend', (e) => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            
            if (dragState.isDragging) {
                e.preventDefault();
                endDrag();
            }
        });
        
        item.addEventListener('touchcancel', () => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            
            if (dragState.isDragging) {
                cancelDrag();
            }
        });
        
        // 마우스 이벤트 (데스크톱 편집 모드)
        item.addEventListener('mousedown', (e) => {
            if (!config.enabled()) return;
            // 삭제 버튼 클릭이면 무시
            if (e.target.closest('.card-delete-btn')) return;
            
            e.preventDefault();
            vibrate(50);
            startDrag(item, index, container, config, e);
        });
    });
    
    // 전역 마우스 이벤트
    document.addEventListener('mousemove', (e) => {
        if (dragState.isDragging) {
            handleDragMove(e.clientX, e.clientY);
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (dragState.isDragging) {
            endDrag();
        }
    });
}

// 드래그 시작
function startDrag(element, index, container, options, touch) {
    const rect = element.getBoundingClientRect();
    
    dragState = {
        isDragging: true,
        draggedEl: element,
        startIndex: index,
        currentIndex: index,
        container: container,
        options: options,
        clone: null,
        offsetX: (touch.clientX || touch.pageX) - rect.left,
        offsetY: (touch.clientY || touch.pageY) - rect.top
    };
    
    element.classList.add('dragging');
    
    // 플레이스홀더 생성
    dragState.placeholder = document.createElement('div');
    dragState.placeholder.className = 'card-placeholder';
    dragState.placeholder.style.width = rect.width + 'px';
    dragState.placeholder.style.height = rect.height + 'px';
    element.parentNode.insertBefore(dragState.placeholder, element.nextSibling);
}

// 드래그 이동
function handleDragMove(clientX, clientY) {
    if (!dragState.isDragging || !dragState.container) return;
    
    const items = Array.from(
        dragState.container.querySelectorAll(dragState.options.itemSelector)
    ).filter(item => item !== dragState.draggedEl && !item.classList.contains('card-placeholder'));
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        if (clientX > rect.left && clientX < rect.right &&
            clientY > rect.top && clientY < rect.bottom) {
            
            // 현재 위치의 실제 인덱스 계산
            const allItems = Array.from(
                dragState.container.querySelectorAll(dragState.options.itemSelector)
            );
            const newIndex = allItems.indexOf(item);
            
            if (newIndex !== dragState.currentIndex) {
                dragState.currentIndex = newIndex;
                
                // 플레이스홀더 위치 업데이트
                if (clientY < centerY || (clientY >= centerY && clientX < centerX)) {
                    item.parentNode.insertBefore(dragState.placeholder, item);
                } else {
                    item.parentNode.insertBefore(dragState.placeholder, item.nextSibling);
                }
                
                vibrate(10);
            }
            break;
        }
    }
}

// 드래그 종료
function endDrag() {
    if (!dragState.isDragging) return;
    
    const { draggedEl, placeholder, startIndex, options, container } = dragState;
    
    // 플레이스홀더 위치에 요소 이동
    if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.insertBefore(draggedEl, placeholder);
        placeholder.remove();
    }
    
    draggedEl.classList.remove('dragging');
    
    // 실제 최종 인덱스 계산
    const allItems = Array.from(
        container.querySelectorAll(options.itemSelector)
    );
    const finalIndex = allItems.indexOf(draggedEl);
    
    // 순서가 변경되었으면 콜백 호출
    if (startIndex !== finalIndex && options.onReorder) {
        options.onReorder(startIndex, finalIndex);
    }
    
    resetDragState();
}

// 드래그 취소
function cancelDrag() {
    if (!dragState.isDragging) return;
    
    const { draggedEl, placeholder } = dragState;
    
    if (placeholder && placeholder.parentNode) {
        placeholder.remove();
    }
    
    if (draggedEl) {
        draggedEl.classList.remove('dragging');
    }
    
    resetDragState();
}

// 상태 초기화
function resetDragState() {
    dragState = {
        isDragging: false,
        draggedEl: null,
        placeholder: null,
        startIndex: -1,
        currentIndex: -1,
        container: null,
        options: null,
        clone: null,
        offsetX: 0,
        offsetY: 0
    };
}
