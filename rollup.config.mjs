import autoExternal from 'rollup-plugin-auto-external';
import commonjs from '@rollup/plugin-commonjs';
import { defineConfig } from 'rollup';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import svelte from 'rollup-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(
      isProduction ? 'production' : 'development',
    ),
  }),
  commonjs(),
];

export default defineConfig([
  {
    input: ['./src/main/index.ts', './src/main/preload.ts'],
    output: {
      format: 'cjs',
      dir: './public/dist/main',
      entryFileNames: '[name].js',
    },
    external: ['electron'],
    plugins: [
      ...plugins,
      autoExternal(),
      resolve(),
      typescript({
        tsconfig: './src/main/tsconfig.json',
      }),
      isProduction && terser(),
    ],
    treeshake: !isProduction,
    watch: {
      clearScreen: true,
    },
  },
  {
    input: './src/renderer/index.ts',
    output: isProduction
      ? {
          format: 'es',
          dir: './public/dist/renderer',
          entryFileNames: '[name].js',
          chunkFileNames: '[hash].js',
        }
      : {
          format: 'iife',
          name: 'renderer',
          file: './public/dist/renderer/index.js',
          inlineDynamicImports: true,
        },
    plugins: [
      ...plugins,
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      svelte({
        preprocess: sveltePreprocess({
          typescript: {
            tsconfigFile: './src/renderer/tsconfig.json',
          },
        }),
        compilerOptions: {
          dev: !isProduction,
        },
      }),
      typescript({
        tsconfig: './src/renderer/tsconfig.json',
      }),
      postcss({
        extract: 'styles.css',
        minimize: isProduction,
      }),
      isProduction && terser(),
      !isProduction &&
        serve({
          host: 'localhost',
          port: 3000,
          contentBase: 'public',
          verbose: false,
        }),

      !isProduction &&
        livereload({
          watch: 'public',
          verbose: false,
        }),
    ],
    onwarn(warning, warn) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        return;
      }
      warn(warning);
    },
    treeshake: !isProduction,
    watch: {
      clearScreen: true,
    },
  },
]);
