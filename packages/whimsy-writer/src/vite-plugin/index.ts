import { watch } from 'chokidar';
import type { PluginOption } from 'vite';
import { statSync } from 'fs';
import { resolve } from 'path';
import { createCodeGen } from '../code-gen';

function ignoreFile(path: string) {
  if (path.includes('node_modules')) return true;
  const stat = statSync(path);
  if (!stat.isFile()) return false;
  return ['.js', '.jsx', '.ts', '.tsx'].every((ext) => !path.endsWith(ext));
}

export const passageListPlugin = (passagePath?: string, generatedPath?: string): PluginOption => {
  return {
    name: 'passage-list',
    configureServer({ config }) {
      const passageRoot = passagePath ? resolve(passagePath) : resolve(config.root, 'src/passages');
      const generatedRoot = generatedPath
        ? resolve(generatedPath)
        : resolve(passageRoot, '../__generated');
      const codeGen = createCodeGen(passageRoot, generatedRoot);
      const watcher = watch(passageRoot.replace(/\\/g, '/'), {
        ignored: ignoreFile,
        persistent: true,
        ignoreInitial: true,
      });
      watcher.on('change', (filePath: string) => codeGen.handle('update', filePath));
      watcher.on('add', (filePath: string) => codeGen.handle('update', filePath));
      watcher.on('unlink', (filePath: string) => codeGen.handle('remove', filePath));
    },
  };
};
