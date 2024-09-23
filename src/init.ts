import { Start } from '@passage/start';
import { SetupOptions } from './store-utils/types';

export function getGameSetupOptions(): SetupOptions {
  return {
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
  };
}
