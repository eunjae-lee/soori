import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import path from 'path';
import pkg from './package.json';

export default defineConfig({
  test: {
    globals: true,
  },
  plugins: [dts()],
  build: {
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
    },
    rollupOptions: {
      output: [{ format: 'esm' }],
      external: (name) => {
        // externalize node.js built-in modules
        if (name.startsWith('node:')) {
          return true;
        }

        // externalize dependencies
        return Object.keys(
          (pkg as Record<string, any>).dependencies || {}
        ).includes(name);
      },
    },
  },
});
