import { cwd } from 'process';
import { createCodeGen } from '../code-gen';

createCodeGen(cwd());
