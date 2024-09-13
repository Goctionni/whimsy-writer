import { Passage } from '../base-components/types';
import { useGameState } from '../init';

export function useCurrentPassage() {
  const history = useGameState((state) => state.history);
  const historyIndex = useGameState((state) => state.historyIndex);
  return history[historyIndex];
}

export function useGameTitle() {
  return useGameState((state) => state.title) ?? 'Untitled whimsy';
}

export function goBack() {
  const state = useGameState.getState();
  if (state.historyIndex < 1) return false;

  useGameState.setState({ historyIndex: state.historyIndex - 1 });
  return true;
}

export function goForwards() {
  const state = useGameState.getState();
  if (state.historyIndex + 1 >= state.history.length) return false;

  useGameState.setState({ historyIndex: state.historyIndex + 1 });
  return true;
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

export function gotoPassage(passage: Passage) {
  useGameState.setState((current) => {
    const newIndex = current.historyIndex + 1;
    const newHistory = [...current.history.slice(0, newIndex), passage];
    return {
      history: newHistory,
      historyIndex: newIndex,
    };
  });
}
