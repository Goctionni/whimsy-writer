import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './__generated/passage-map.ts';
import './style/base.css';

const [BaseLayout] = await Promise.all([
  (() => import('./base-components/base-layout.tsx').then((module) => module.BaseLayout))(),
  (() => import('./init'))(),
]);

createRoot(document.body.firstElementChild!).render(
  <StrictMode>
    <BaseLayout />
  </StrictMode>,
);
