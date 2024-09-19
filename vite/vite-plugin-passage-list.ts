import chokidar from 'chokidar';
import { PluginOption } from 'vite';
import { onFileChange, onFileRemove } from './utils/write-passage-map';
import { statSync } from 'fs';

function ignoreFile(path: string) {
  if (path.includes('node_modules')) return true;
  const stat = statSync(path);
  if (!stat.isFile()) return false;
  return ['.js', '.jsx', '.ts', '.tsx'].every((ext) => !path.endsWith(ext));
}

export const passageListPlugin: (path: string) => PluginOption = (path) => {
  return {
    name: 'passage-list',
    configureServer() {
      const watcher = chokidar.watch(path, { ignored: ignoreFile, persistent: true });
      watcher.on('change', onFileChange);
      watcher.on('add', onFileChange);
      watcher.on('unlink', onFileRemove);
    },
  };
};
