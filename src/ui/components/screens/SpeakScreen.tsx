// ========================================
// SpeakScreen.tsx - 말하기 화면 (메인 AAC 화면)
//
// 구조: EmergencyBar → SuggestionBar → CategoryBar → CardGrid
// ========================================

import EmergencyBar from '../cards/EmergencyBar';
import SuggestionBar from '../cards/SuggestionBar';
import CategoryBar from '../cards/CategoryBar';
import CardGrid from '../cards/CardGrid';

export default function SpeakScreen() {
  return (
    <>
      <EmergencyBar />
      <SuggestionBar />
      <CategoryBar />
      <CardGrid />
    </>
  );
}
