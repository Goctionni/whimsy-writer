import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BaseLayout } from './base-components/base-layout.tsx';
import './init.ts';
import './style/base.css';
import { $var, set } from './store-utils/var-utils.ts';

createRoot(document.body.firstElementChild!).render(
  <StrictMode>
    <BaseLayout />
  </StrictMode>,
);

set($var.score, 5);
set($var.player.age, 10);
set($var.player.inventory, []);
set($var.player.inventory[0].qty, 5);
