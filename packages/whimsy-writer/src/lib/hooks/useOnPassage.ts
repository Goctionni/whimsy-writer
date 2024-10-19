import { useEffect, useRef } from 'react';

export function useOnPassage(callback: () => unknown) {
  const isFirstRender = useRef(true);
  const callbackRef = useRef(callback);

  useEffect(() => {
    if (!isFirstRender.current) return;
    isFirstRender.current = false;
    callbackRef.current();
  }, []);
}
