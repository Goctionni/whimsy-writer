import { copyFileSync, rmSync } from 'fs';
import { resolve } from 'path';
import { cwd } from 'process';
import { copyDirectory, getExampleDirectory } from '../util/utils';

const exampleDir = getExampleDirectory();
const targetDir = resolve(cwd(), '__gen_template');

rmSync(targetDir, { recursive: true, force: true });
copyDirectory(exampleDir, targetDir, (fromPath, toPath) => {
  copyFileSync(fromPath, `${toPath}.template`);
});
