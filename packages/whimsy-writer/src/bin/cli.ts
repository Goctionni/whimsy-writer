#!/usr/bin/env node

import { cwd } from 'process';
import { createCodeGen } from '../code-gen/index';
import { resolve } from 'path';
import { statSync } from 'fs';
import { watch } from 'chokidar';
import chalk from 'chalk';
import { getArg } from 'cli-utils';

const passageRootRaw = getArg('passageRoot', { shorthand: 'pr' }) || 'src/passages';
const generateRootRaw = getArg('generateRoot', { shorthand: 'gr' }) || 'src/__generated';
const passageRoot = resolve(cwd(), passageRootRaw);
const generateRoot = resolve(cwd(), generateRootRaw);
const doWatch = getArg('watch', { boolean: true, shorthand: 'w' });

const codeGen = createCodeGen(passageRoot, generateRoot);
console.log(`${chalk.green('[Whimsy CodeGen]:')} Updated Passage Map and generated types`);

if (doWatch) {
  function ignoreFile(path: string) {
    if (path.includes('node_modules')) return true;
    const stat = statSync(path);
    if (!stat.isFile()) return false;
    return ['.js', '.jsx', '.ts', '.tsx'].every((ext) => !path.endsWith(ext));
  }

  const watcher = watch(passageRoot.replace(/\\/g, '/'), {
    ignored: ignoreFile,
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on('change', (filePath: string) => codeGen.handle('update', filePath));
  watcher.on('add', (filePath: string) => codeGen.handle('update', filePath));
  watcher.on('unlink', (filePath: string) => codeGen.handle('remove', filePath));

  console.log(`${chalk.green('[Whimsy CodeGen]:')} Watching '${passageRootRaw}' for changes`);
}
