import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vite } from 'soori';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vite()],
  resolve: {
    alias: [
      {
        find: /^soori$/,
        replacement: path.resolve(__dirname, '../soori/src/index.ts'),
      },
      {
        find: /^@soori\/plugin\-json$/,
        replacement: path.resolve(
          __dirname,
          '../../packages/plugin-json/src/index.ts'
        ),
      },
    ],
    //   alias:
    //     process.env.NODE_ENV === 'production'
    //       ? []
    //       : [
    //           {
    //             find: /^soori$/,
    //             replacement: path.resolve(__dirname, '../soori/src/index.tssss'),
    //           },
    //         ],
  },
});
