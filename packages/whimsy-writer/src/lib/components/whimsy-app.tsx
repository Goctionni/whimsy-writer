import { ReactNode } from 'react';
import { WhimsyStoreContext, setupGameStore } from '../hooks/store/state-store';
import { SetupOptions } from '../hooks/store/types';

interface WhimsyAppProps {
  initialStateCreator: () => SetupOptions;
  children: ReactNode;
}

export function WhimsyApp({ initialStateCreator, children }: WhimsyAppProps) {
  const store = setupGameStore(initialStateCreator);
  return <WhimsyStoreContext.Provider value={store}>{children}</WhimsyStoreContext.Provider>;
}
