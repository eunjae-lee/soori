import { defineConfig, definePlugin } from 'soori';
import json from '@soori/plugin-json';
import fs from 'fs/promises';

export default defineConfig({
  plugins: [
    definePlugin({
      ...json({
        name: 'my-jsons',
        objectPerFile: true,
        watch: ['src/jsons/*.json'],
      }),
      name: 'my-jsons',
      output: {
        packageExports: {
          import: './submodules/my-jsons/index.js',
          types: './submodules/my-jsons/types/index.d.ts',
        },
        onBuildEnd: async ({ dir, execaCommand }) => {
          await execaCommand(
            `npx -p typescript tsc *.ts --target es2020 --moduleResolution bundler`,
            {
              cwd: dir,
              shell: true,
            }
          );
          await execaCommand(
            `npx -p typescript tsc *.ts --declaration --emitDeclarationOnly --target es2020 --moduleResolution bundler --outDir types`,
            { cwd: dir, shell: true }
          );
        },
      },
    }),
  ],
});
