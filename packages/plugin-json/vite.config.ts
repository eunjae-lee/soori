import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  test: {
    globals: true,
  },
  plugins: [dts()],
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
