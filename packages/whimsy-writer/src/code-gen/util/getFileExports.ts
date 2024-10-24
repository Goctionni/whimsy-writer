import parser from '@babel/parser';
import _traverse from '@babel/traverse';
import { readFileSync } from 'fs';

type FileExports = Record<string, string>; // <ExportName, ComponentName>
type Traverse = typeof _traverse;
const traverse: Traverse = (_traverse as unknown as { default: Traverse }).default;

export function getFileExports(filePath: string) {
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
