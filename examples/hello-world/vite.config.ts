import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { cwd } from 'process';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { passageListPlugin } from 'whimsy-writer/vite-plugin';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [passageListPlugin('src/passages'), react(), ...(command === 'serve' ? [] : [viteSingleFile()])],
  base: './',
  resolve: {
    alias: {
      '@passage': resolve(cwd(), 'src/passages'),
      '@p': resolve(cwd(), 'src/passages'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss({ config: 'tailwind.config.ts' }), autoprefixer()],
    },
  },
}));
