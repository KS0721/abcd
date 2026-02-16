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
