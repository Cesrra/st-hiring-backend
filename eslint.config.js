const eslintPluginPrettier = require('eslint-plugin-prettier');
const prettierConfig = require('./.prettierrc');
const { configs: tsConfigs } = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    files: ['src/**/*.ts'],
    ignores: ['dist/**/*', 'node_modules/**/*'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      jest: require('eslint-plugin-jest'),
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...tsConfigs.recommended.rules,
      'prettier/prettier': ['error', prettierConfig],
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
      //'custom-rules/restrict-index-imports': 'error',
    },
  },
];
