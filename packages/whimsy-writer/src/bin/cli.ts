#!/usr/bin/env node

import { argv, cwd } from 'process';
import { createCodeGen } from '../code-gen/index';
import { resolve } from 'path';
import { statSync } from 'fs';
import chokidar from 'chokidar';
import chalk from 'chalk';

interface ArgOptions {
  boolean?: boolean;
  shorthand?: string;
  multiple?: boolean;
}
function getArg(argName: string, options: ArgOptions & { multiple: true }): string[];
function getArg(argName: string, options: ArgOptions & { multiple?: false | never; boolean: true }): boolean;
function getArg(argName: string, options: ArgOptions & { multiple?: false | never; boolean?: false | never }): string;
function getArg(argName: string, { boolean = false, shorthand, multiple = false }: ArgOptions = {}) {
  const values: string[] = [];
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === `--${argName}` || (shorthand && arg === `-${shorthand}`)) {
      if (boolean) return true;
      else if (!multiple) return argv[i + 1];
      else values.push(argv[i + 1]);
    } else if (arg.startsWith(`--${argName}=`) || (shorthand && arg.startsWith(`--${shorthand}=`))) {
      const valueStr = arg.slice(arg.indexOf('=') + 1);
      if (boolean) {
        if (['1', 'true', 'on'].includes(valueStr.toLowerCase())) return true;
        if (['0', 'false', 'off'].includes(valueStr.toLowerCase())) return false;
        return valueStr;
      } else if (!multiple) {
        return valueStr;
      } else {
        values.push(valueStr);
      }
    }
  }
  if (boolean) return false;
  if (!multiple || !values.length) return null;
  return values;
}

const passageRootRaw = getArg('passageRoot', { shorthand: 'pr' }) || 'src/passages';
const generateRootRaw = getArg('generateRoot', { shorthand: 'gr' }) || 'src/__generated';
const passageRoot = resolve(cwd(), passageRootRaw);
const generateRoot = resolve(cwd(), generateRootRaw);
const watch = getArg('watch', { boolean: true, shorthand: 'w' });

const codeGen = createCodeGen(passageRoot, generateRoot);
console.log(`${chalk.green('[Whimsy CodeGen]:')} Updated Passage Map and generated types`);

if (watch) {
  function ignoreFile(path: string) {
    if (path.includes('node_modules')) return true;
    const stat = statSync(path);
    if (!stat.isFile()) return false;
    return ['.js', '.jsx', '.ts', '.tsx'].every((ext) => !path.endsWith(ext));
  }

  const watcher = chokidar.watch(passageRoot.replace(/\\/g, '/'), {
    ignored: ignoreFile,
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on('change', (filePath) => codeGen.handle('update', filePath));
  watcher.on('add', (filePath) => codeGen.handle('update', filePath));
  watcher.on('unlink', (filePath) => codeGen.handle('remove', filePath));

  console.log(`${chalk.green('[Whimsy CodeGen]:')} Watching '${passageRootRaw}' for changes`);
}
