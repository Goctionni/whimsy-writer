import { useCurrentPassage } from '../story-utils/state-store';

export function StoryOutlet() {
  const CurrentPassage = useCurrentPassage();
  if (!CurrentPassage) return <div>Error! No current passage</div>;

  return (
    <div className="prose prose-invert">
      <CurrentPassage />
    </div>
  );
}
