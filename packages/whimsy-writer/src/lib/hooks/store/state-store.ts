import { create, StoreApi, UseBoundStore } from 'zustand';
import { GameStateStore, HistoryItem, SaveDataParsed, SaveDataRaw, SetupOptions, VariableMutation } from './types';
import { createContext, useCallback, useContext } from 'react';
import { useGetPassage } from './store-utils';

export const WhimsyStoreContext = createContext<null | UseBoundStore<StoreApi<GameStateStore>>>(null);

type UseStore = UseBoundStore<StoreApi<GameStateStore>>;
export const useGetGameState = (): UseStore => {
  const useStore = useContext(WhimsyStoreContext);
  if (!useStore) throw new Error('Whimsy Store not initialized');
  return useStore;
};

export const useGameState = <U>(selector: (state: GameStateStore) => U): U => {
  return useGetGameState()(selector);
};

export const useSetGameState = (): UseStore['setState'] => useGetGameState().setState;

function saveStateToSessionStore(
  state: SaveDataParsed & { title: string },
  getPassageName: (passage: Passage) => null | PassageName,
) {
  const { title, historyIndex, variables, variableChanges } = state;
  const history = state.history.map((item) => ({ ...item, passage: getPassageName(item.passage) }));
  const json = JSON.stringify({ history, historyIndex, variables, variableChanges });
  sessionStorage.setItem(`ww-session-${title}`, json);
}

function deleteStateFromSessionStore(title: string) {
  sessionStorage.removeItem(`ww-session-${title}`);
}

function applyChange(
  variables: unknown,
  direction: 'backwards' | 'forwards',
  { path, before, after }: VariableMutation,
): unknown {
  const value = direction === 'backwards' ? before : after;
  if (path.length === 0) return value;
  const [attr, ...restPath] = path;

  if (!variables) return variables;
  if (typeof variables !== 'object') return variables;
  if (Array.isArray(variables)) {
    const changeIndex = Number(attr);
    return variables.map((item, index) => {
      if (index !== changeIndex) return item;
      return applyChange(item, direction, { path: restPath, before, after });
    });
  }
  return {
    ...variables,
    [attr]: applyChange((variables as Record<string | symbol, unknown>)[attr], direction, {
      path: restPath,
      before,
      after,
    }),
  };
}

function applyChanges<T>(variables: T, direction: 'backwards' | 'forwards', changes: VariableMutation[]): T {
  const orderedChanges = direction === 'forwards' ? changes : changes.toReversed();
  return orderedChanges.reduce((vars, change) => applyChange(vars, direction, change) as T, variables);
}

export function setupGameStore(getOptions: () => SetupOptions): UseBoundStore<StoreApi<GameStateStore>> {
  const options = getOptions();
  const store = create<GameStateStore>((set) => ({
    title: options.title,
    passageMap: options.passageMap,
    history: [{ passage: options.openingPassage, variableChanges: [] }],
    historyIndex: 0,
    variables: options.variables,
    variableChanges: [],
    load: (state) => set(state),
    goBack: () =>
      set((state) => {
        if (state.historyIndex < 1) return {};
        let variables = state.variables;
        // First rollback changes made since opening the passage
        variables = applyChanges(variables, 'backwards', state.variableChanges);
        // The rollback changes made from previous passage to current passage
        const variableChanges = state.history[state.historyIndex].variableChanges;
        variables = applyChanges(variables, 'backwards', variableChanges);

        return {
          historyIndex: state.historyIndex - 1,
          variables,
          variableChanges: [],
        };
      }),
    goForwards: () =>
      set((state) => {
        if (state.historyIndex + 1 >= state.history.length) return {};

        let variables = state.variables;
        // First rollback changes made since opening the passage
        variables = applyChanges(variables, 'backwards', state.variableChanges);
        // Then roll forwards the changes made from current to next passage
        const variableChanges = state.history[state.historyIndex + 1].variableChanges;
        variables = applyChanges(variables, 'backwards', variableChanges);

        return {
          historyIndex: state.historyIndex + 1,
          variables,
          variableChanges: [],
        };
      }),
    gotoPassage: (passage) =>
      set((state) => {
        const newIndex = state.historyIndex + 1;
        const newHistoryItem: HistoryItem = {
          passage,
          variableChanges: [...state.variableChanges],
        };
        const newHistory = [...state.history.slice(Math.max(0, newIndex - 19), newIndex), newHistoryItem];
        saveStateToSessionStore(
          {
            title: state.title!,
            history: newHistory,
            historyIndex: Math.min(newHistory.length - 1, newIndex),
            variableChanges: [],
            variables: state.variables,
          },
          (passage: Passage) => {
            const keys = Object.keys(options.passageMap) as PassageName[];
            return keys.find((key) => options.passageMap[key] === passage) ?? null;
          },
        );
        return {
          history: newHistory,
          historyIndex: Math.min(newHistory.length - 1, newIndex),
          variableChanges: [],
        };
      }),
    restart: () => {
      const options = getOptions();
      deleteStateFromSessionStore(options.title);
      return set({
        title: options.title,
        history: [{ passage: options.openingPassage, variableChanges: [] }],
        historyIndex: 0,
        variables: options.variables,
        variableChanges: [],
      });
    },
  }));

  return store;
}

export function useTryLoadSessionSave() {
  const { title, load } = useGameState((state) => ({ title: state.title, load: state.load }));
  const getPassage = useGetPassage();

  return useCallback(() => {
    const sessionSave = sessionStorage.getItem(`ww-session-${title}`);

    if (sessionSave) {
      const raw: SaveDataRaw = JSON.parse(sessionSave);
      if (raw) {
        const parsed: SaveDataParsed = {
          ...raw,
          history: raw.history.map((item) => ({
            ...item,
            passage: getPassage(item.passage)!,
          })),
        };
        load(parsed);
      }
    }
  }, [title, load, getPassage]);
}