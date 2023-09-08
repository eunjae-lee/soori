import { defineConfig, definePlugin } from 'soori';
import json from '@soori/plugin-json';
import fs from 'fs/promises';

export default defineConfig({
  plugins: [
    definePlugin({
      output: {
        dir: 'node_modules/my-jsons',
        onBuildStart: async ({ dir }) => {
          await fs.writeFile(
            `${dir}/package.json`,
            `{
            "name": "my-jsons",
            "private": true,
            "type": "module",
            "main": "index.ts"
          }`
          );
        },
      },
      ...json({ name: 'json-gen', watch: ['src/jsons/*.json'] }),
    }),
  ],
});
