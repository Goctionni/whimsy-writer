import { Start } from '@passage/start';
import { SetupOptions } from './store-utils/types';
import { passageMap } from './__generated/passage-map';

export function getGameSetupOptions(): SetupOptions {
  return {
    title: 'Hello World',
    openingPassage: Start,
    passageMap,
    variables: {
      score: 0,
    },
  };
}
