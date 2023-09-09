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
      name: 'my-virtual-module',
      output: {
        dir: 'node_modules/my-virtual-module',
        onBuildEnd: async ({ dir, execaCommand }) => {
          await fs.writeFile(
            `${dir}/package.json`,
            JSON.stringify(
              {
                name: 'my-virtual-module',
                private: true,
                type: 'module',
                main: 'dist/index.cjs',
                module: 'dist/index.mjs',
                types: 'dist/index.d.ts',
                exports: {
                  '.': {
                    import: './dist/index.mjs',
                    require: './dist/index.cjs',
                    types: './dist/index.d.ts',
                  },
                },
              },
              null,
              2
            )
          );
          await execaCommand(`rm -rf src`);
          await execaCommand(`mkdir src`);
          await execaCommand(`cp *.ts src/`, { shell: true });
          await execaCommand(`npx unbuild`, {
            shell: true,
          });
        },
      },
    }),
  ],
});
