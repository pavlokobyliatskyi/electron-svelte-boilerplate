import eslintJs from '@eslint/js';
import eslintTs from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier/flat';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import typescript from '@typescript-eslint/eslint-plugin';

export default eslintTs.config([
  // Common
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      // Type Safety and Type Checking
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',

      // Code Style and Naming Conventions
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
      ],
      '@typescript-eslint/prefer-as-const': 'error',

      // Error Prevention and Code Quality
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-this-alias': 'error',

      // General JavaScript Rules
      strict: ['error', 'global'],
    },
  },
  // Main
  {
    files: ['src/main/**/*.{ts}'],
    plugins: {
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      parserOptions: {
        project: './src/main/tsconfig.json',
      },
    },
  },
  // Renderer
  {
    files: ['src/renderer/**/*.{ts,svelte.ts}'],
    plugins: {
      '@typescript-eslint': typescript,
      svelte: svelte,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './src/renderer/tsconfig.json',
      },
    },
  },
  {
    files: ['src/renderer/**/*.svelte'],
    plugins: {
      svelte: svelte,
    },
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.svelte'],
      },
    },
  },
  // Ignore
  {
    ignores: [
      'node_modules',
      'dist',
      'public',
      'eslint.config.mjs',
      'prettier.config.mjs',
      'rollup.config.mjs',
      'notarize.js',
    ],
  },
  // Prettier
  prettier,
]);
