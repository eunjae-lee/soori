import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
  },
  plugins: [dts()],
  resolve: {
    alias:
      process.env.NODE_ENV === 'production'
        ? []
        : [
          {
            find: /^soori$/,
            replacement: path.resolve(__dirname, '../soori/src/index.ts'),
          },
        ],
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'src/index.ts',
      fileName: 'index',
    },
    rollupOptions: {
      output: [{ format: 'esm' }],
      external: (name) => {
        if (name.startsWith('node:')) {
          return true;
        }
        return ['glob'].includes(name);
      },
    },
  },
});
