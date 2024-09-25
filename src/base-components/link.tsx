import { ReactNode } from 'react';
import { useGetPassage, useGotoPassage } from '../store-utils/store-utils';

interface Props {
  to?: PassageName;
  $to?: string; // intended for `BarStage${$var.stage}` type passage name references
  onClick?: (e: MouseEvent) => unknown;
  children: ReactNode;
  textLink?: boolean;
}
export function Link({ to, $to, children, onClick, textLink }: Props) {
  const getPassage = useGetPassage();
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
    <button className={textLink ? 'ww-link-text' : 'ww-btn'} onClick={clickHandler} type="button">
      {children}
    </button>
  );
}
