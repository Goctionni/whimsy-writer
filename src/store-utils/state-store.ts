import { create, StoreApi, UseBoundStore } from 'zustand';
import { Passage } from '../base-components/types';

interface GameStateStore {
  title?: string;
  history: Passage[];
  historyIndex: number;
  variables: Variables;
}

interface SetupOptions {
  title: string;
  openingPassage: Passage;
  variables: Variables;
}

export function setupGameStore(options: SetupOptions): UseBoundStore<StoreApi<GameStateStore>> {
  return create<GameStateStore>((set, get) => ({
    title: options.title,
    history: [options.openingPassage],
    historyIndex: 0,
    variables: options.variables,
  }));
}
