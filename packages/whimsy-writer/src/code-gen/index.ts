import { globby } from 'globby';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { getFileExports } from './util/getFileExports';
import { getPassageNames } from './util/getPassageNames';
import { generatePassageMap } from './util/generatePassageMap';
import { generateTypeDefs } from './util/generateTypeDefs';

function readIfExists(filepath: string) {
  if (!existsSync(filepath)) return '';
  return readFileSync(filepath, 'utf-8');
}

export function createCodeGen(passageRoot: string, generatedRoot: string) {
  if (!existsSync(generatedRoot)) mkdirSync(generatedRoot, { recursive: true });

  const passageMap = new Map<string, Record<string, string>>();
  const filePaths = {
    'type-defs': resolve(generatedRoot, '../__generated/passage-names.d.ts'),
    'passage-map': resolve(generatedRoot, '../__generated/passage-map.ts'),
  };
  const currentFileContents = {
    'type-defs': readIfExists(filePaths['type-defs']),
    'passage-map': readIfExists(filePaths['passage-map']),
  };

  function updateFiles() {
    const { passageNames, duplicateNameErrors } = getPassageNames(passageMap);
    const typeDefs = generateTypeDefs(passageNames);
    if (typeDefs !== currentFileContents['type-defs']) {
      writeFileSync(filePaths['type-defs'], typeDefs, 'utf-8');
    }
    const mapContent = generatePassageMap(passageRoot, passageMap, duplicateNameErrors);
    if (mapContent !== currentFileContents['passage-map']) {
      writeFileSync(filePaths['passage-map'], mapContent, 'utf-8');
    }
  }

  // initialize
  async function init() {
    const root = passageRoot.replace(/\\/g, '/');
    const files = await globby([`${root}/**/*.{ts,tsx,js,jsx}`]);
    for (const file of files) {
      passageMap.set(file, getFileExports(file));
    }
    updateFiles();
  }

  void init();

  let debounceTimeout: null | NodeJS.Timeout = null;
  function scheduleUpdate() {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(updateFiles, 50);
  }

  return {
    handle: (event: 'update' | 'remove', filepath: string) => {
      if (event === 'update') {
        passageMap.set(filepath.replace(/\\/g, '/'), getFileExports(filepath));
        scheduleUpdate();
      } else if (event === 'remove') {
        passageMap.delete(filepath.replace(/\\/g, '/'));
        scheduleUpdate();
      }
    },
  };
}
