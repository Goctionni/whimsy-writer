#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { basename, resolve } from 'path';
import { cwd, exit } from 'process';
import { copyDirectory } from '../util/utils';
import { getArg } from 'cli-utils';
import { render } from 'ink';
import { App } from './components/App';
import type { ReactNode } from 'react';
import { logError } from './log-error';

const templateDir = resolve(import.meta.dirname, '../__gen_template');

const workingDirectory = cwd();
const args = getArg();
const targetIsCwd = args && args[0] === '.';

function getName(value: string) {
  if (value === value.toLowerCase()) {
    value = value[0].toUpperCase() + value.slice(1);
  }

  if (!value.includes(' ')) {
    value = value.replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
  }

  return value;
}

function getDirName(value: string) {
  return value
    .toLowerCase()
    .replace(/([a-z])'([a-z])/g, '$1$2')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function parseArgv(): { name: string; dirName: string } {
  if (!args?.length) return { name: '', dirName: '' };

  if (targetIsCwd) {
    const curDirName = basename(workingDirectory);
    return { name: getName(curDirName), dirName: curDirName };
  }

  const [input] = args;
  return { name: getName(input), dirName: getDirName(input) };
}

function createProject(name: string, dirName: string) {
  const targetDir = targetIsCwd ? workingDirectory : resolve(workingDirectory, dirName);
  const packageName = getDirName(dirName);
  if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
  const filesInTargetDir = readdirSync(targetDir);
  if (filesInTargetDir.length) throw new Error('Target directory not empty');
  copyDirectory(templateDir, targetDir, (fromPath, toPath) => {
    const fileContent = readFileSync(fromPath, 'utf-8')
      .replace(/Hello World/g, name)
      .replace(/hello-world/g, packageName);

    writeFileSync(toPath.replace(/\.template$/, ''), fileContent, 'utf-8');
  });
}

const { unmount } = render(
  <App
    {...parseArgv()}
    targetIsCwd={targetIsCwd}
    createProject={createProject}
    exitApp={exitApp}
  />,
);

function exitApp(node: ReactNode, exitCode: number = 0, ex?: Error) {
  unmount();
  console.log('');
  if (node) {
    const { unmount: unmountExitMessage } = render(node);
    queueMicrotask(() => {
      unmountExitMessage();
      if (ex) logError(ex);
      console.log('');
      exit(exitCode);
    });
  }
  return null;
}
