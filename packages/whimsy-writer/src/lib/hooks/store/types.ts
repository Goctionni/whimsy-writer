export interface HistoryItem {
  passage: Passage;
  variableChanges: VariableMutation[];
}

export interface SetupOptions {
  title: string;
  openingPassage: Passage;
  passageMap: PassageMap;
  variables: Variables;
}

type SaveStateProps = 'history' | 'historyIndex' | 'variables' | 'variableChanges';

export interface GameStateStore {
  title?: string;
  history: HistoryItem[];
  historyIndex: number;
  variables: Variables;
  variableChanges: VariableMutation[];
  passageMap: PassageMap;
  goBack: () => void;
  goForwards: () => void;
  gotoPassage: (passage: Passage) => void;
  load: (state: Pick<GameStateStore, SaveStateProps>) => void;
  restart: () => void;
}

export type SaveDataParsed = Pick<GameStateStore, SaveStateProps>;

export type SaveDataRaw = Omit<SaveDataParsed, 'history'> & {
  history: Array<{ passage: string; variableChanges: VariableMutation[] }>;
};

export interface VariableMutation {
  path: Array<string | symbol>;
  before: unknown;
  after: unknown;
}

export type SaveData = Pick<
  GameStateStore,
  'history' | 'historyIndex' | 'variables' | 'variableChanges'
>;
