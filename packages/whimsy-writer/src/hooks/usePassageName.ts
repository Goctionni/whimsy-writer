import { useGetPassageName, useCurrentPassage } from '../store-utils/store-utils';

export function usePassageName() {
  const passage = useCurrentPassage();
  const getPassageName = useGetPassageName();
  return getPassageName(passage);
}
