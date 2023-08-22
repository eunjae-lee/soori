import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: 'src/index.ts',
      fileName: 'index',
    },
    rollupOptions: {
      output: [{ format: 'esm' }],
    },
  },
});
