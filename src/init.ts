import { Start } from '@passage/start';
import { setupGameStore } from './store-utils/state-store';

export const useGameState = setupGameStore({
  title: 'My epic adventure',
  openingPassage: Start,
  variables: {
    score: 0,
    player: {
      age: 0,
      inventory: [
        {
          id: 1,
          qty: 0,
        },
      ],
    },
  },
});
