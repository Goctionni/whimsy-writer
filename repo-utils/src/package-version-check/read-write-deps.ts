import { z } from 'zod';

import { resolve } from 'path';
import { execSync } from 'child_process';
import { RepoDeps } from './types';
import { env } from 'process';

const __dirname = import.meta.dirname;
const __root = resolve(__dirname, '../../..');

const DepMapDef = z.record(z.string());
const ResultDef = z.record(DepMapDef.optional());

export function readRepositoryDependencies(): RepoDeps {
  const depsResultStr = execSync(`npm -ws -i pkg get dependencies`, { encoding: 'utf-8', cwd: __root });
  const devDepsResultStr = execSync(`npm -ws -i pkg get devDependencies`, { encoding: 'utf-8', cwd: __root });
  const depsJson = ResultDef.parse(JSON.parse(depsResultStr));
  const devDepsJson = ResultDef.parse(JSON.parse(devDepsResultStr));
  const repos = [...new Set([...Object.keys(depsJson), ...Object.keys(devDepsJson)])];
  const result: RepoDeps = {};
  for (const repo of repos) {
    result[repo] = {
      dependencies: depsJson[repo] ?? {},
      devDependencies: devDepsJson[repo] ?? {},
    };
  }

  return result;
}

function getRootWorkspaceName() {
  return JSON.parse(execSync(`npm pkg get name`, { encoding: 'utf-8', cwd: __root })) as string;
}

export function writeWorkspaceDependencies(
  workspace: string,
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>,
) {
  const setArgs: string[] = [];
  if (Object.keys(dependencies).length) setArgs.push(`dependencies='${JSON.stringify(dependencies)}'`);
  if (Object.keys(devDependencies).length) setArgs.push(`devDependencies='${JSON.stringify(devDependencies)}'`);
  if (!setArgs.length) return;

  if (workspace === getRootWorkspaceName()) {
    execSync(`npm --json pkg set ${setArgs.join(' ')}`, { encoding: 'utf-8', cwd: __root, shell: env.SHELL });
  } else {
    execSync(`npm --json -w ${workspace} pkg set ${setArgs.join(' ')}`, {
      encoding: 'utf-8',
      cwd: __root,
      shell: env.SHELL,
    });
  }
}
