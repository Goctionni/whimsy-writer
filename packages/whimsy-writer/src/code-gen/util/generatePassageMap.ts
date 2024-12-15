import type { DuplicateNameError, PassageMap } from '../types';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

if (!('__dirname' in globalThis)) {
  globalThis.require = createRequire(import.meta.url);
  globalThis.__filename = fileURLToPath(import.meta.url);
  globalThis.__dirname = dirname(__filename);
}

function generateLazyImports(
  passageRoot: string,
  passageMap: PassageMap,
  path: string,
  excludeNames: string[] = [],
) {
  const lazyImportLines: string[] = [];

  const fileExports = passageMap.get(path);
  if (!fileExports) return lazyImportLines;

  const entries = Object.entries(fileExports).filter(([, name]) => !excludeNames.includes(name));
  if (entries.length === 0) return lazyImportLines;

  const importPath = path.replace(/\\/g, '/').replace(passageRoot.replace(/\\/g, '/'), '@passage');

  for (const [key, value] of entries) {
    lazyImportLines.push(
      `  ${value}: lazy(() => import('${importPath}').then(module => ({default: module.${key}}))),`,
    );
  }

  return lazyImportLines;
}

const workspaceRoot = __dirname.slice(0, __dirname.lastIndexOf('dist'));
const templatePath = resolve(workspaceRoot, 'templates/passage-map-template.ts');
const template = readFileSync(templatePath, 'utf-8');

export function generatePassageMap(
  passageRoot: string,
  passageMap: PassageMap,
  duplicateNameErrors: DuplicateNameError[],
) {
  const lazyImportLines = [...passageMap.keys()]
    .map((filePath) =>
      generateLazyImports(
        passageRoot,
        passageMap,
        filePath,
        duplicateNameErrors.map((item) => item.passageName),
      ),
    )
    .flat();

  return template
    .split('\n')
    .filter((line) => !line.includes('// @ts-nocheck'))
    .map((line) => {
      if (line.includes('// [Token] PassageMap Lines')) {
        return lazyImportLines.join('\n');
      }
      if (line.includes('// [Token] Passage Map Errors')) {
        return `export const passageMapDuplicates = ${JSON.stringify(duplicateNameErrors)} as const`;
      }
      return line;
    })
    .join('\n');
}
