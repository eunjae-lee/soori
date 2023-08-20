import { defineConfig } from 'vite';
import { dependencies } from './package.json';

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'src/cli.ts',
      fileName: 'cli',
    },
    rollupOptions: {
      output: [{ format: 'esm' }],
      external: (name) => {
        if (dependencies[name]) {
          return true;
        }
        if (name.startsWith('node:')) {
          return true;
        }
        return false;
      },
    },
  },
});
