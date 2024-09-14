import { ComponentType, ReactNode } from 'react';
import { useGotoPassage } from '../store-utils/store-utils';

interface Props {
  to?: ComponentType<unknown>;
  onClick?: (e: MouseEvent) => unknown;
  children: ReactNode;
}
export function Link({ to, children, onClick }: Props) {
  const gotoPassage = useGotoPassage();

  function clickHandler(e: React.MouseEvent) {
    onClick?.(e.nativeEvent);
    if (to) gotoPassage(to);
  }
  return (
    <button className="ww-btn" onClick={clickHandler}>
      {children}
    </button>
  );
}
