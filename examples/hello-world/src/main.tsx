import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BaseLayout } from 'whimsy-writer/src/components/base-layout.tsx';
import './__generated/passage-map.ts';
import './style/base.css';

createRoot(document.body.firstElementChild!).render(
  <StrictMode>
    <BaseLayout />
  </StrictMode>,
);
