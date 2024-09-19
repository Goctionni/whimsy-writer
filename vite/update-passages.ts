import { glob } from 'tinyglobby';
import { onFileChange } from './utils/write-passage-map';

glob(['src/passages/**/*.{ts,tsx,js,jsx}']).then((files) => files.forEach(onFileChange));

console.log('[Whimsy Writer] Updated generated passage map.');
