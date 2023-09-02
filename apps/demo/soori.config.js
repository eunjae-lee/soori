import { defineConfig, definePlugin } from 'soori';
import json from '@soori/plugin-json';
import path from 'node:path';
import fs from 'node:fs/promises';

export default defineConfig({
  plugins: [
    {
      name: 'test',
      build: {
        handle: () => {
          return {
            fileName: 'index.js',
            content: 'export const name = "Eunjae"',
          };
        },
      },
    },
    json({ name: 'json-gen', watch: ['src/jsons/*.json'] }),
  ],
});
