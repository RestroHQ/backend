import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierRecommendedConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    plugins: {
      prettier: prettier,
    },
    rules: {
      'no-console': 'warn',
      'prettier/prettier': 'error',
    },
    ignores: ['node_modules/', 'dist/', 'build/'],
  },
  prettierRecommendedConfig,
];
