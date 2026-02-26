// ========================================
// CardGrid.tsx - 카드 그리드 (카테고리별 카드 표시)
//
// 🤖 AI TODO [스마트 카드 정렬 + 시각적 강조 - AI 통합 지점 #6]
// ────────────────────────────────────────────────────────────
//
// ■ 역할: LLM이 현재 대화 문맥에 맞춰 카드 표시 순서를 동적으로 재배열하고,
//   관련성 높은 카드에 시각적 강조(테두리 하이라이트 등)를 적용
//
// ■ 입력:
//   1. cards: Card[]                    — 현재 카테고리의 전체 카드 목록
//   2. selectedCards: Card[]            — 현재 선택된 카드들 (문장 구성 중)
//   3. history: string[]                — 최근 발화 기록
//   4. currentCategory: CategoryId      — 현재 카테고리
//   5. timeOfDay: string                — 시간대
//
// ■ 처리:
//   1. 사용 빈도 기반 정렬: 자주 쓰는 카드를 카테고리 상단에 배치
//      예) 'food' 카테고리에서 "밥"을 매일 10번 사용 → 첫 번째 위치
//   2. 문맥 기반 정렬: 선택된 카드와 관련성 높은 카드 상단 배치
//      예) "학교" 선택 → action 카테고리에서 "공부해요", "놀아요" 상단
//   3. 시각적 강조: 추천 카드에 푸른 테두리 or 미세 배경색 변경
//   4. 시간대 반영: 아침 food 카테고리 → "밥", "빵" 상단 / 저녁 → "저녁밥" 상단
//
// ■ 출력:
//   sortedCards: Card[]                 — 정렬된 카드 배열
//   highlightedCardIds: Set<string>     — 강조 표시할 카드 ID 집합
//
// ■ 구현 방식:
//   - 카테고리 변경 시 LLM에게 정렬 요청 (디바운스 300ms)
//   - LLM 응답 전까지 기본 순서(기존 순서) 유지
//   - 로컬 캐시: 같은 문맥에서 같은 카테고리 → 캐시된 순서 사용
//   - 오프라인 폴백: 사용 빈도 통계만으로 로컬 정렬
//
// ■ 논문 근거:
//   - Light & McNaughton (2014): 사용자 운동 능력에 따른 그리드 크기/배치 최적화
//   - Thistle & Wilkinson (2015): 시각적 강조가 AAC 카드 선택 속도에 미치는 영향
//   - Wilkinson & McIlvane (2002): AAC 디스플레이 구성이 선택 정확도에 미치는 영향
// ========================================

import { useCallback } from 'react';
import type { Card } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useScanningStore } from '../../store/useScanningStore';
import { useScanHighlight } from '../../hooks/useScanning';
import AACCard from './AACCard';
import styles from '../../styles/CardGrid.module.css';
import cardStyles from '../../styles/AACCard.module.css';
import scanStyles from '../../styles/Scanning.module.css';

/** 스캐닝 돌아가기 버튼 */
function ScanBackButton() {
  const highlighted = useScanHighlight('card', 0);
  return (
    <div
      className={highlighted ? scanStyles.backBtnHighlight : scanStyles.backBtn}
      data-scan-phase="card"
      data-scan-index={0}
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span>돌아가기</span>
    </div>
  );
}

/** 스캐닝 하이라이트가 적용된 카드 래퍼 */
function ScannableCard({ index, card, isSelected, isEditMode, onSelect, onDelete, onEdit }: {
  index: number;
  card: Card;
  isSelected: boolean;
  isEditMode: boolean;
  onSelect: (card: Card) => void;
  onDelete?: (cardId: string) => void;
  onEdit?: (card: Card) => void;
}) {
  const highlighted = useScanHighlight('card', index);
  return (
    <div
      className={highlighted ? scanStyles.highlightCard : undefined}
      data-scan-phase="card"
      data-scan-index={index}
    >
      <AACCard
        card={card}
        isSelected={isSelected}
        isEditMode={isEditMode}
        onSelect={onSelect}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </div>
  );
}

export default function CardGrid() {
  const currentCategory = useAppStore((s) => s.currentCategory);
  const cards = useAppStore((s) => s.cards[s.currentCategory] || []);
  const selectedCards = useAppStore((s) => s.selectedCards);
  const editMode = useAppStore((s) => s.editMode);
  const selectCard = useAppStore((s) => s.selectCard);
  const deselectCard = useAppStore((s) => s.deselectCard);
  const deleteUserCard = useAppStore((s) => s.deleteUserCard);
  const openAddCardModal = useAppStore((s) => s.openAddCardModal);
  const openEditCardModal = useAppStore((s) => s.openEditCardModal);
  const isScanning = useScanningStore((s) => s.isActive);

  const selectedIds = new Set(selectedCards.map((c) => c.id));

  const handleSelect = useCallback((card: Card) => {
    if (selectedIds.has(card.id)) {
      deselectCard(card.id);
    } else {
      selectCard(card);
    }
  }, [selectedIds, selectCard, deselectCard]);

  const handleDelete = useCallback((cardId: string) => {
    deleteUserCard(currentCategory, cardId);
  }, [currentCategory, deleteUserCard]);

  const handleEdit = useCallback((card: Card) => {
    openEditCardModal(card, currentCategory);
  }, [currentCategory, openEditCardModal]);

  const handleAddCard = useCallback(() => {
    openAddCardModal(currentCategory);
  }, [currentCategory, openAddCardModal]);

  return (
    <div className={styles.cardsArea} data-scan-scroll>
      <div className={styles.cardsGrid}>
        {/* 스캐닝 모드: 돌아가기 버튼 */}
        {isScanning && <ScanBackButton />}

        {cards.map((card, i) => (
          <ScannableCard
            key={card.id}
            index={i + 1}
            card={card}
            isSelected={selectedIds.has(card.id)}
            isEditMode={editMode}
            onSelect={handleSelect}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}

        {/* 카드 추가 버튼 (스캐닝 중이 아닐 때만) */}
        {!isScanning && (
          <div
            className={cardStyles.addCard}
            onClick={handleAddCard}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleAddCard(); } }}
            role="button"
            tabIndex={0}
            aria-label="카드 추가"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>추가</span>
          </div>
        )}
      </div>
    </div>
  );
}
