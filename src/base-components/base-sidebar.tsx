import { goBack, goForwards, useCanGoBack, useCanGoForwards, useGameTitle } from '../store-utils/store-utils';

export function BaseSidebar() {
  const title = useGameTitle();
  const canGoBack = useCanGoBack();
  const canGoForwards = useCanGoForwards();

  return (
    <div className="p-1">
      <h1 className="text-3xl text-center mb-4">{title}</h1>
      <div className="flex justify-between">
        <button className="ww-btn" disabled={!canGoBack} onClick={goBack}>
          Back
        </button>
        <button className="ww-btn" disabled={!canGoForwards} onClick={goForwards}>
          Forwards
        </button>
      </div>
    </div>
  );
}
