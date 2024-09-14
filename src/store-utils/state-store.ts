import { create, StoreApi, UseBoundStore } from 'zustand';
import { Passage } from '../base-components/types';

interface GameStateStore {
  title?: string;
  history: Passage[];
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
    history: [options.openingPassage],
    historyIndex: 0,
    variables: options.variables,
    goBack: () =>
      set((state) => {
        if (state.historyIndex < 1) return {};
        return { historyIndex: state.historyIndex - 1 };
      }),
    goForwards: () =>
      set((state) => {
        if (state.historyIndex + 1 >= state.history.length) return {};
        return { historyIndex: state.historyIndex + 1 };
      }),
    gotoPassage: (passage) =>
      set((state) => {
        const newIndex = state.historyIndex + 1;
        const newHistory = [...state.history.slice(0, newIndex), passage];
        return {
          history: newHistory,
          historyIndex: newIndex,
        };
      }),
  }));
}
