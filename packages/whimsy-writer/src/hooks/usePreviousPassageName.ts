import { useGameState } from '../store-utils/state-store';
import { useGetPassageName } from '../store-utils/store-utils';

export function usePreviousPassageName() {
  const previousPassage = useGameState((state) => {
    if (state.historyIndex === 0) return null;
    return state.history[state.historyIndex - 1].passage;
  });
  const getPassageName = useGetPassageName();

  return previousPassage ? getPassageName(previousPassage) : null;
}
