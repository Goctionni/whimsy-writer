import { ComponentType, useEffect, useRef } from 'react';
import { BaseSidebar } from './base-sidebar';
import { BaseStoryOutlet } from './base-story-outlet';
import { useTryLoadSessionSave } from '../store-utils/state-store';

interface Props {
  Sidebar?: ComponentType<unknown>;
  StoryOutlet?: ComponentType<unknown>;
}

export function BaseLayout({ Sidebar = BaseSidebar, StoryOutlet = BaseStoryOutlet }: Props) {
  const tryLoadSessionSave = useTryLoadSessionSave();
  const isInitialRender = useRef(true);
  useEffect(() => {
    if (!isInitialRender.current) return;
    isInitialRender.current = false;
    tryLoadSessionSave();
  }, [tryLoadSessionSave]);

  return (
    <div className="flex w-full h-full">
      <div className="w-72 flex">
        <Sidebar />
      </div>
      <main className="flex-1 p-4">
        <StoryOutlet />
      </main>
    </div>
  );
}
