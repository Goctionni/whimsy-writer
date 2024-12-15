import { execSync, exec } from 'child_process';
import { stdout, stderr } from 'process';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

if (!('__dirname' in globalThis)) {
  globalThis.require = createRequire(import.meta.url);
  globalThis.__filename = fileURLToPath(import.meta.url);
  globalThis.__dirname = dirname(__filename);
}

const __root = resolve(__dirname, '../../..');

const workspaces = Object.keys(
  JSON.parse(execSync(`npm -ws pkg get name`, { encoding: 'utf-8', cwd: __root })) as Record<
    string,
    string
  >,
);

const errorsIn: string[] = [];
console.log(`> ${chalk.yellowBright('Repo Depcheck')}`);
for await (const { workspace, i } of workspaces.map((workspace, i) => ({
  workspace,
  i,
}))) {
  console.log(
    `- [${i + 1}/${workspaces.length}] ${chalk.cyan('Checking dependencies:')} ${workspace}`,
  );

  const status = await execAsync(
    `npx -w ${workspace} depcheck . --ignore-bin-package --ignores=@passage/*,@p/*`,
  );
  if (status) errorsIn.push(workspace);
  console.log('');
}

if (errorsIn.length === 0) {
  console.log(`${chalk.green('No dependency-issues found in any workspace')}`);
} else {
  console.log(`${chalk.red('Dependency-issues found in workspaces')}`);
  for (const name of errorsIn) {
    console.log(`${chalk.red('-')} ${name}`);
  }
}

function execAsync(cmd: string) {
  return new Promise<number>((resolve) => {
    const childProcess = exec(cmd, {
      cwd: __root,
      shell: 'bash',
    });

    childProcess.stdout?.pipe(stdout);
    childProcess.stderr?.pipe(stderr);
    childProcess.on('close', (code) => resolve(code || 0));
  });
}
