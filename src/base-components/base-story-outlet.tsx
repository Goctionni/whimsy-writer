import { Suspense } from 'react';
import { useCurrentPassage } from '../store-utils/store-utils';

export function BaseStoryOutlet() {
  const CurrentPassage = useCurrentPassage();
  if (!CurrentPassage) return <div>Error! No current passage</div>;

  return (
    <div className="prose prose-invert">
      <Suspense>
        <CurrentPassage />
      </Suspense>
    </div>
  );
}
