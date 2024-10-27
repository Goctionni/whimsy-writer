import { ComponentType, useEffect, useRef } from 'react';
import { BaseSidebar } from './base-sidebar';
import { BaseStoryOutlet } from './base-story-outlet';
import { useTryLoadSessionSave } from '../hooks/store/state-store';

interface BaseLayoutProps {
  Sidebar?: ComponentType<unknown>;
  StoryOutlet?: ComponentType<unknown>;
}

export function BaseLayout({ Sidebar = BaseSidebar, StoryOutlet = BaseStoryOutlet }: BaseLayoutProps) {
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
