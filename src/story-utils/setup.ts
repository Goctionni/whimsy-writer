import { ComponentType } from 'react';

import { useGameState } from './state-store';

interface SetupConfig {
  title: string;
  openingPassage: ComponentType<unknown>;
}

export function setup(config: SetupConfig) {
  useGameState.setState({ ...config, history: [config.openingPassage], historyIndex: 0 });
}
