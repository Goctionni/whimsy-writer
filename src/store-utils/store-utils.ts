import { useGameState } from '../init';

export function useCurrentPassage() {
  const history = useGameState((state) => state.history);
  const historyIndex = useGameState((state) => state.historyIndex);
  return history[historyIndex].passage;
}

export function useGameTitle() {
  return useGameState((state) => state.title) ?? 'Untitled whimsy';
}

export function canGoBack() {
  const state = useGameState.getState();
  return state.historyIndex >= 1;
}

export function canGoForwards() {
  const state = useGameState.getState();
  return state.historyIndex + 1 < state.history.length;
}

export function useCanGoBack() {
  return useGameState((state) => state.historyIndex >= 1);
}

export function useCanGoForwards() {
  return useGameState((state) => state.historyIndex + 1 < state.history.length);
}

export function useGotoPassage() {
  return useGameState((state) => state.gotoPassage);
}

export function useGoBack() {
  return useGameState((state) => state.goBack);
}

export function useGoForwards() {
  return useGameState((state) => state.goForwards);
}
