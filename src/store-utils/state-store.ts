import { create, StoreApi, UseBoundStore } from 'zustand';
import { Passage } from '../base-components/types';

interface HistoryItem {
  passage: Passage;
  variables: Variables;
}

interface GameStateStore {
  title?: string;
  history: HistoryItem[];
  historyIndex: number;
  variables: Variables;
  goBack: () => void;
  goForwards: () => void;
  gotoPassage: (passage: Passage) => void;
}

interface SetupOptions {
  title: string;
  openingPassage: Passage;
  variables: Variables;
}

export function setupGameStore(options: SetupOptions): UseBoundStore<StoreApi<GameStateStore>> {
  return create<GameStateStore>((set) => ({
    title: options.title,
    history: [{ passage: options.openingPassage, variables: options.variables }],
    historyIndex: 0,
    variables: options.variables,
    goBack: () =>
      set((state) => {
        if (state.historyIndex < 1) return {};
        return {
          historyIndex: state.historyIndex - 1,
          variables: state.history[state.historyIndex - 1].variables,
        };
      }),
    goForwards: () =>
      set((state) => {
        if (state.historyIndex + 1 >= state.history.length) return {};
        return {
          historyIndex: state.historyIndex + 1,
          variables: state.history[state.historyIndex + 1].variables,
        };
      }),
    gotoPassage: (passage) =>
      set((state) => {
        const newIndex = state.historyIndex + 1;
        const newHistoryItem: HistoryItem = {
          passage,
          variables: state.variables,
        };
        const newHistory = [...state.history.slice(Math.max(0, newIndex - 20), newIndex), newHistoryItem];
        return {
          history: newHistory,
          historyIndex: newIndex,
        };
      }),
  }));
}
