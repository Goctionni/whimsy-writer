import chokidar from 'chokidar';
import { statSync } from 'fs';
import { onFileChange, onFileRemove } from './utils/write-passage-map';

function ignoreFile(path: string) {
  if (path.includes('node_modules')) return true;
  const stat = statSync(path);
  if (!stat.isFile()) return false;
  return ['.js', '.jsx', '.ts', '.tsx'].every((ext) => !path.endsWith(ext));
}

console.log('[Whimsy writer] Watching passages for changes');

const watcher = chokidar.watch('src/passages', { ignored: ignoreFile, persistent: true });
watcher.on('change', onFileChange);
watcher.on('add', onFileChange);
watcher.on('unlink', onFileRemove);
