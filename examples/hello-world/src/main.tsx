import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { SetupOptions } from 'whimsy-writer';
import { BaseLayout, WhimsyApp } from 'whimsy-writer';
import { passageMap } from './__generated/passage-map.ts';
import './style/base.css';
import 'whimsy-writer/css';
import { Start } from '@passage/start.tsx';

declare global {
  interface Variables {
    score: number;
  }
}

const setup = (): SetupOptions => ({
  title: 'Hello World',
  openingPassage: Start,
  passageMap,
  variables: {
    score: 0,
  },
});

createRoot(document.body.firstElementChild!).render(
  <StrictMode>
    <WhimsyApp initialStateCreator={setup}>
      <BaseLayout />
    </WhimsyApp>
  </StrictMode>,
);
