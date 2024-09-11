import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { cwd } from 'process';
import { resolve } from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src',
  publicDir: '../public',
  resolve: {
    alias: { '/src': resolve(cwd(), 'src') },
  },
  css: {
    postcss: {
      plugins: [tailwindcss({ config: 'vite/tailwind.config.ts' }), autoprefixer()],
    },
  },
});
