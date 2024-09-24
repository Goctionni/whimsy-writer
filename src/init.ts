import { CoDStart } from '@passage/CoDStart';
import { SetupOptions } from './store-utils/types';
import { passageMap } from './__generated/passage-map';

export function getGameSetupOptions(): SetupOptions {
  return {
    title: 'Cloak of Darkness',
    openingPassage: CoDStart,
    passageMap,
    variables: {
      barvisits: 0,
      cloakroomVisits: 0,
      foyerVisits: 0,
      cloaked: true,
      darkness: 0,
    },
  };
}
