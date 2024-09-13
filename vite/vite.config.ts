import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { cwd } from 'process';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { passageListPlugin } from './passage-list-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [passageListPlugin('src/passages/**/*.tsx'), react()],
  root: 'src',
  publicDir: '../public',
  resolve: {
    alias: {
      '/src': resolve(cwd(), 'src'),
      '@passage': resolve(cwd(), 'src/passages'),
      '@p': resolve(cwd(), 'src/passages'),
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss({ config: 'vite/tailwind.config.ts' }), autoprefixer()],
    },
  },
});
