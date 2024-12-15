import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { cli: 'src/index.tsx' },
    sourcemap: true,
    clean: true,
    dts: true,
    format: 'esm',
    cjsInterop: true,
    // shims: true,
    replaceNodeEnv: false,
    target: 'node18',
    external: ['assert', 'fs', 'path', 'process', 'react-devtools-core'],
    banner: {
      js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
    },
    env: {
      DEV: 'false',
      PROD: 'true',
      mode: 'production',
      NODE_ENV: 'production',
    },
  },
]);
