import { ReactNode } from 'react';
import { getPassage, useGotoPassage } from '../store-utils/store-utils';

interface Props {
  to?: PassageName;
  $to?: string; // intended for `BarStage${$var.stage}` type passage name references
  onClick?: (e: MouseEvent) => unknown;
  children: ReactNode;
}
export function Link({ to, $to, children, onClick }: Props) {
  const gotoPassage = useGotoPassage();

  function clickHandler(e: React.MouseEvent) {
    onClick?.(e.nativeEvent);
    if (to) {
      const passage = getPassage(to);
      if (passage) gotoPassage(passage);
    }
    if ($to) {
      const passage = getPassage($to);
      if (passage) gotoPassage(passage);
    }
  }
  return (
    <button className="ww-btn" onClick={clickHandler} type="button">
      {children}
    </button>
  );
}
