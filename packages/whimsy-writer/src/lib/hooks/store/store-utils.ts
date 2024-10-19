import { useCallback, useMemo } from 'react';
import { SaveDataParsed, SaveDataRaw } from './types';
import { create } from 'zustand';
import { useGameState } from './state-store';

export function useCurrentPassage() {
  return useGameState((state) => state.history[state.historyIndex].passage);
}

export function useGameTitle() {
  return useGameState((state) => state.title) ?? 'Untitled whimsy';
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

// Just to update the list when save/loading
const useSavesUpdatedStore = create<{
  lastUpdate: number;
  triggerUpdate: () => void;
}>((set) => ({
  lastUpdate: 0,
  triggerUpdate: () => set({ lastUpdate: Date.now() }),
}));

export function useSaveGame() {
  const getPassageName = useGetPassageName();
  const triggerUpdate = useSavesUpdatedStore((state) => state.triggerUpdate);
  const { title, history, historyIndex, variables, variableChanges } = useGameState((state) => ({
    title: state.title,
    history: state.history.map((item) => ({ ...item, passage: getPassageName(item.passage) })),
    historyIndex: state.historyIndex,
    variables: state.variables,
    variableChanges: state.variableChanges,
  }));
  return useCallback(
    (name: string) => {
      const json = JSON.stringify({ history, historyIndex, variables, variableChanges });
      localStorage.setItem(`ww-save-${title}-${name}`, json);
      triggerUpdate();
    },
    [history, historyIndex, variables, variableChanges, title, triggerUpdate],
  );
}

export function useRemoveSavedGame() {
  const triggerUpdate = useSavesUpdatedStore((state) => state.triggerUpdate);
  const title = useGameState((state) => state.title);
  return useCallback(
    (name: string) => {
      localStorage.removeItem(`ww-save-${title}-${name}`);
      triggerUpdate();
    },
    [title, triggerUpdate],
  );
}

export function useLoadGame() {
  const { title, load } = useGameState((state) => ({ load: state.load, title: state.title }));
  const getPassage = useGetPassage();
  return useCallback(
    (name: string) => {
      const json = localStorage.getItem(`ww-save-${title}-${name}`);
      if (!json) return;
      const raw = JSON.parse(json) as SaveDataRaw;
      if (!raw) return;
      const parsed: SaveDataParsed = {
        ...raw,
        history: raw.history.map((item) => ({
          ...item,
          passage: getPassage(item.passage)!,
        })),
      };
      load(parsed);
    },
    [getPassage, load, title],
  );
}

export function useSaveList(): string[] {
  const title = useGameState((state) => state.title);
  const lastUpdate = useSavesUpdatedStore((state) => state.lastUpdate);
  const prefix = `ww-save-${title}-`;
  return useMemo(() => {
    if (lastUpdate < 0) return []; // Dummy, just for exhaustive deps
    return Object.keys(localStorage)
      .filter((key) => key.startsWith(prefix))
      .map((key) => key.slice(prefix.length));
  }, [prefix, lastUpdate]);
}

export function useRestartGame() {
  return useGameState((state) => state.restart);
}

export function usePassageMap() {
  return useGameState((state) => state.passageMap);
}

export function useGetPassage() {
  const passageMap = usePassageMap();
  return useCallback(
    (name: string): Passage | null => {
      if (name in passageMap) {
        return passageMap[name as keyof typeof passageMap];
      }
      return null;
    },
    [passageMap],
  );
}

export function useGetPassageName() {
  const passageMap = usePassageMap();
  return useCallback(
    (passage: Passage) => {
      return (
        (Object.keys(passageMap) as Array<keyof typeof passageMap>).find(
          (passageName) => passageMap[passageName] === passage,
        ) ?? null
      );
    },
    [passageMap],
  );
}
