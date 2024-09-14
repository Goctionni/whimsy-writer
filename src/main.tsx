import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BaseLayout } from './base-components/base-layout.tsx';
import './init.ts';
import './style/base.css';

createRoot(document.body.firstElementChild!).render(
  <StrictMode>
    <BaseLayout />
  </StrictMode>,
);
