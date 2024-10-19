import { Suspense } from 'react';
import { useCurrentPassage } from '../hooks/store/store-utils';

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
