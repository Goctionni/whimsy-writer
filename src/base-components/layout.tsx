import { ComponentType } from 'react';
import { Sidebar as DefaultSidebar } from './sidebar';
import { StoryOutlet as DefaultStoryOutlet } from './story-outlet';

interface Props {
  Sidebar?: ComponentType<unknown>;
  StoryOutlet?: ComponentType<unknown>;
}

export function Layout({ Sidebar = DefaultSidebar, StoryOutlet = DefaultStoryOutlet }: Props) {
  return (
    <div className="flex w-full h-full">
      <div className="w-52">
        <Sidebar />
      </div>
      <main className="flex-1 p-1">
        <StoryOutlet />
      </main>
    </div>
  );
}
