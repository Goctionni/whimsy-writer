import chokidar from 'chokidar';
import { PluginOption } from 'vite';
import { createHash } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, sep } from 'path';
import { cwd } from 'process';

const template = readFileSync(resolve(__dirname, 'template', 'passage-map-template.ts'), 'utf-8');
const IMPORT_TOKEN = '// [Token] Imports here';
const ADD_COMPONENTS_TOKEN = '// [Token] addComponentsHere';

let serializeTimeout = 0;

let files: string[] = [];
function serializePassageMap() {
  const imports: string[] = [];
  const objectLines: string[] = [];

  files
    .map((file) => file.split(sep).join('/'))
    .forEach((file) => {
      const hash = createHash('md5').update(file).digest('hex');
      imports.push(`import * as P_${hash} from '@p/${file.slice(13, -4)}';`);
      objectLines.push(`addComponents('${hash}', P_${hash});`);
    });

  return template.replace(IMPORT_TOKEN, imports.join('\n')).replace(ADD_COMPONENTS_TOKEN, objectLines.join('\n'));
}

function writePassageMap(content: string) {
  writeFileSync(resolve(cwd(), 'src', '__generated', 'passage-map.ts'), content, 'utf-8');
}

function schedulePassageMapUpdate() {
  clearTimeout(serializeTimeout);
  serializeTimeout = setTimeout(() => {
    const passageMap = serializePassageMap();
    writePassageMap(passageMap);
  }, 50) as unknown as number;
}

export const passageListPlugin: (path: string) => PluginOption = (path) => {
  return {
    name: 'passage-list',
    configureServer(server) {
      const watcher = chokidar.watch(path, { ignored: /node_modules/, persistent: true });
      watcher.on('add', (path) => {
        if (files.includes(path)) return;
        files.push(path);
        schedulePassageMapUpdate();
      });
      watcher.on('unlink', (path) => {
        if (!files.includes(path)) return;
        files = files.filter((item) => item !== path);
        schedulePassageMapUpdate();
      });
    },
  };
};
