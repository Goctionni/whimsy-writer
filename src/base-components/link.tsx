import { ComponentType, ReactNode } from 'react';
import { gotoPassage } from '../story-utils/state-store';

interface Props {
  to: ComponentType<unknown>;
  children: ReactNode;
}
export function Link({ to, children }: Props) {
  return (
    <button className="ww-btn" onClick={() => gotoPassage(to)}>
      {children}
    </button>
  );
}
