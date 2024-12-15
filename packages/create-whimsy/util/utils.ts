import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const EXAMPLE_NAME = 'hello-world';
const IGNORE = ['dist', 'node_modules', '__generated'];

export function getExampleDirectory() {
  const __root = execSync('npm prefix', { encoding: 'utf-8' }).trim();
  const lsOut = execSync(`npm ls ${EXAMPLE_NAME} --depth 0`, {
    encoding: 'utf-8',
    cwd: __root,
  });
  const regex = new RegExp(`${EXAMPLE_NAME}@\\d+\\.+\\d+\\.+\\d+ -> (.*)\\n`); // /hello-world@\d+\.\d+\.\d+ -> (.*)\n/;
  const matches = regex.exec(lsOut);
  if (!matches) throw new Error('Could not find example workspace');
  return resolve(__root, matches[1]);
}

type CopyFileFn = (fromPath: string, toPath: string) => void;

export function copyDirectory(from: string, to: string, copyFile: CopyFileFn) {
  if (!existsSync(to)) mkdirSync(to, { recursive: true });
  const items = readdirSync(from).filter((item) => !IGNORE.includes(item));
  for (const item of items) {
    const source = resolve(from, item);
    const dest = resolve(to, item);
    if (statSync(source).isDirectory()) {
      copyDirectory(source, dest, copyFile);
    } else {
      copyFile(source, dest);
    }
  }
}
