import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { 'index': 'src/lib/index.ts', 'vite-plugin': 'src/vite-plugin/index.ts' },
    sourcemap: true,
    clean: true,
    dts: true,
    format: 'esm',
    target: 'es2023',
  },
  {
    entry: { style: 'src/lib/index.css', cli: 'src/bin/cli.ts' },
    format: 'esm',
  },
]);
