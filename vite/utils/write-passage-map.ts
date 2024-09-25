import parser from '@babel/parser';
import _traverse from '@babel/traverse';
import { mkdirSync, readFileSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { cwd } from 'process';
type Traverse = typeof _traverse;
const traverse: Traverse = (_traverse as unknown as { default: Traverse }).default;

type FileExports = Record<string, string>; // <ExportName, ComponentName>
const passageMap = new Map<string, FileExports>(); // key = filepath

const generatedDirPath = resolve(cwd(), 'src', '__generated');
if (!existsSync(generatedDirPath)) mkdirSync(generatedDirPath, { recursive: true });
const generatedMapFilePath = resolve(generatedDirPath, 'passage-map.ts');
const generatedTypesFilePath = resolve(generatedDirPath, 'passage-names.d.ts');

function getNamedExports(filePath: string) {
  const fileExports: FileExports = {};
  const content = readFileSync(filePath, 'utf-8');
  const ast = parser.parse(content, { sourceType: 'module', plugins: ['typescript', 'jsx'] });

  traverse(ast, {
    ExportNamedDeclaration({ node: { declaration, specifiers } }) {
      if (declaration?.type === 'VariableDeclaration') {
        declaration.declarations.forEach((decl) => {
          if ('name' in decl.id) {
            fileExports[decl.id.name] = decl.id.name;
          }
        });
      }
      if (declaration?.type === 'FunctionDeclaration') {
        const funcName = declaration.id?.name;
        if (funcName) {
          fileExports[funcName] = funcName;
        }
      }
      if (!declaration && specifiers) {
        specifiers.forEach((specifier) => {
          if ('name' in specifier.exported) {
            const name = specifier.exported.name;
            fileExports[name] = name;
          }
        });
      }
    },
    ExportDefaultDeclaration(q) {
      const decl = q.node.declaration;
      if (decl && decl.type === 'FunctionDeclaration') {
        const funcName = decl.id?.name;
        if (funcName) fileExports['default'] = funcName;
      }
      if (decl && decl.type === 'Identifier') {
        fileExports['default'] = decl.name;
      }
    },
  });

  return fileExports;
}

function getPassageNames() {
  const nameMap: Record<string, string[]> = {};
  passageMap.forEach((fileExports, path) => {
    Object.values(fileExports).forEach((passageName) => {
      if (!(passageName in nameMap)) nameMap[passageName] = [];
      nameMap[passageName].push(path);
    });
  });

  const passageNames: string[] = [];
  const duplicates: Array<{ passageName: string; filePaths: string[] }> = [];
  for (const [passageName, filePaths] of Object.entries(nameMap)) {
    if (filePaths.length > 1) {
      duplicates.push({ passageName, filePaths });
    } else {
      passageNames.push(passageName);
    }
  }

  return { passageNames, duplicates };
}

function generateLazyImports(path: string, excludeNames: string[] = []) {
  const lazyImportLines: string[] = [];

  const fileExports = passageMap.get(path);
  if (!fileExports) return lazyImportLines;

  const entries = Object.entries(fileExports).filter(([, name]) => !excludeNames.includes(name));
  if (entries.length === 0) return lazyImportLines;

  const importPath = path.replace(/\\/g, '/').replace(/^src\//, '../');

  for (const [key, value] of entries) {
    lazyImportLines.push(`  ${value}: lazy(() => import('${importPath}').then(module => ({default: module.${key}}))),`);
  }

  return lazyImportLines;
}

function generateImportLine(path: string, excludeNames: string[] = []) {
  const fileExports = passageMap.get(path);
  if (!fileExports) return null;

  const entries = Object.entries(fileExports).filter(([, name]) => !excludeNames.includes(name));
  if (entries.length === 0) return null;

  const importPath = path.replace(/\\/g, '/').replace(/^src\//, '../');

  if ('default' in fileExports && entries.length === 1) {
    return `import ${fileExports.default} from '${importPath}';`;
  }

  const nameImports = entries
    .filter(([key]) => key !== 'default')
    .map(([key, value]) => {
      if (key === value) return key;
      return `${key} as ${value}`;
    });

  if ('default' in fileExports) {
    return `import ${fileExports.default}, { ${nameImports.join(', ')} } from '${importPath}';`;
  }
  return `import { ${nameImports.join(', ')} } from '${importPath}';`;
}

const template = readFileSync(resolve(cwd(), 'vite', 'utils', 'template', 'passage-map-template.ts'), 'utf-8');

function generatePassageMapFileContent({ passageNames, duplicates }: ReturnType<typeof getPassageNames>) {
  // const importLines = [...passageMap.keys()].map((filePath) =>
  //   generateImportLine(
  //     filePath,
  //     duplicates.map((item) => item.passageName),
  //   ),
  // );
  const lazyImportLines = [...passageMap.keys()]
    .map((filePath) =>
      generateLazyImports(
        filePath,
        duplicates.map((item) => item.passageName),
      ),
    )
    .flat();

  return template
    .split('\n')
    .map((line) => {
      // if (line.includes('// [Token] Imports')) {
      //   return importLines.join('\n');
      // }
      if (line.includes('// [Token] PassageMap Lines')) {
        return lazyImportLines.join('\n');
      }
      if (line.includes('// [Token] Passage Map Errors')) {
        return `export const passageMapDuplicates = ${JSON.stringify(duplicates)} as const`;
      }
      return line;
    })
    .join('\n');
}

let currentFileContents = existsSync(generatedMapFilePath) ? readFileSync(generatedMapFilePath, 'utf-8') : '';
function updatePassageMapFile() {
  const passageNames = getPassageNames();

  const updatedMapContents = generatePassageMapFileContent(passageNames);
  if (currentFileContents === updatedMapContents) return;

  writeFileSync(
    generatedTypesFilePath,
    [
      'declare global {',
      `  type Passage = FunctionComponent<unknown>;`,
      `  type PassageName = ${passageNames.passageNames.map((str) => `'${str}'`).join(' | ')};`,
      `  type PassageMap = Record<PassageName, Passage>;`,
      '}',
      'export {};',
    ].join('\n'),
    'utf-8',
  );

  writeFileSync(generatedMapFilePath, updatedMapContents, 'utf-8');
  currentFileContents = updatedMapContents;
}

let updateScheduled = false;
function scheduleUpdate() {
  if (updateScheduled) return;
  updateScheduled = true;
  queueMicrotask(() => {
    updatePassageMapFile();
    updateScheduled = false;
  });
}

export function onFileChange(path: string) {
  passageMap.set(path, getNamedExports(path));
  scheduleUpdate();
}

export function onFileRemove(path: string) {
  passageMap.delete(path);
  scheduleUpdate();
}
