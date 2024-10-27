import { useGameState } from './store/state-store';
import { useGetPassageName } from './store/store-utils';

export function usePreviousPassageName() {
  const previousPassage = useGameState((state) => {
    if (state.historyIndex === 0) return null;
    return state.history[state.historyIndex - 1].passage;
  });
  const getPassageName = useGetPassageName();

  return previousPassage ? getPassageName(previousPassage) : null;
}
