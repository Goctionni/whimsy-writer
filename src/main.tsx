import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './__generated/passage-map.ts';
import './style/base.css';

Promise.all([
  (() => import('./base-components/base-layout.tsx').then((module) => module.BaseLayout))(),
  (() => import('./init'))(),
]).then(([BaseLayout]) => {
  createRoot(document.body.firstElementChild!).render(
    <StrictMode>
      <BaseLayout />
    </StrictMode>,
  );
});
