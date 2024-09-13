import { ComponentType, ReactNode } from 'react';
import { gotoPassage } from '../store-utils/store-utils';

interface Props {
  to: ComponentType<unknown>;
  onClick: (e: MouseEvent) => unknown;
  children: ReactNode;
}
export function Link({ to, children, onClick }: Props) {
  function clickHandler(e: React.MouseEvent) {
    onClick(e.nativeEvent);
    gotoPassage(to);
  }
  return (
    <button className="ww-btn" onClick={clickHandler}>
      {children}
    </button>
  );
}
