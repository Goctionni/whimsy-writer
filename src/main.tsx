import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Layout } from './base-components/layout.tsx';
import { setup } from './story-utils/setup.ts';
import { Start } from './passages/start.tsx';

setup({
  title: 'My epic adventure',
  openingPassage: Start,
});

createRoot(document.body).render(
  <StrictMode>
    <Layout />
  </StrictMode>,
);
