import { useCurrentPassage, useGetPassageName } from './store/store-utils';

export function usePassageName() {
  const passage = useCurrentPassage();
  const getPassageName = useGetPassageName();
  return getPassageName(passage);
}
