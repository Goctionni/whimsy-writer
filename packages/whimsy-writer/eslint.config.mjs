import tseslint from 'typescript-eslint';
import baseConfig from 'eslint-config-base';

export default tseslint.config({ ignores: ['dist', 'src/code-gen/util/template'] }, { extends: baseConfig });
