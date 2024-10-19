import { createLogger, defineConfig, LogErrorOptions } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import dts from 'vite-plugin-dts';

const logger = createLogger();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src/lib/**/*.ts', 'src/lib/**/*.tsx', 'src/code-gen/**/*.ts', 'src/vite-plugin/**/*.ts'],
      outDir: 'dist',
      rollupTypes: true,
      tsconfigPath: resolve(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  customLogger: { ...logger, error: handleError },
  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        'index': resolve(__dirname, 'src/lib/index.ts'),
        'hooks': resolve(__dirname, 'src/lib/hooks/index.ts'),
        'components': resolve(__dirname, 'src/lib/components/index.ts'),
        'vite-plugin': resolve(__dirname, 'src/vite-plugin/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'path',
        'fs',
        'vite',
        'chokidar',
        'globby',
        '@babel/parser',
        '@babel/traverse',
      ],
    },
  },
});

function handleError(msg: string, options: LogErrorOptions) {
  const linesOut: string[] = [];
  const linesIn = msg.split('\n');
  for (let i = 0; i < linesIn.length; i++) {
    const line = linesIn[i];
    if (
      [
        `Cannot find name 'Passage'`,
        `Cannot find name 'PassageName'`,
        `Cannot find name 'PassageMap'`,
        `Cannot find name 'Variables'`,
      ].some((ignore) => line.includes(ignore))
    ) {
      i += 3;
      continue;
    } else {
      linesOut.push(line);
    }
  }
  if (linesOut.length) return logger.error(linesOut.join('\n'), options);
}
