import { getPassageName, useCurrentPassage } from '../store-utils/store-utils';

export function usePassageName() {
  const passage = useCurrentPassage();
  return getPassageName(passage);
}
