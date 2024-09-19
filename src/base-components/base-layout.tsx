import { ComponentType } from 'react';
import { BaseSidebar } from './base-sidebar';
import { BaseStoryOutlet } from './base-story-outlet';

interface Props {
  Sidebar?: ComponentType<unknown>;
  StoryOutlet?: ComponentType<unknown>;
}

export function BaseLayout({ Sidebar = BaseSidebar, StoryOutlet = BaseStoryOutlet }: Props) {
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
