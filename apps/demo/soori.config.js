import { defineConfig, definePlugin } from 'soori';
import json from '@soori/plugin-json';
import markdown from 'unplugin-vue-markdown/vite';
import path from 'node:path';
import fs from 'node:fs/promises';

export default defineConfig({
  plugins: [
    definePlugin({
      name: 'markdownInVue',
      build: [
        {
          watch: ['src/md/*.md'],
          handle: async () => {
            const files = await fs.readdir('src/md');
            return {
              fileName: 'index.ts',
              content: files
                .map((file) => {
                  const fileNameWithoutExt = file.replace(/\.md$/, '');
                  return `export { default as ${fileNameWithoutExt} } from './${fileNameWithoutExt}.vue';`;
                })
                .join('\n'),
            };
          },
        },
        {
          watch: ['src/md/*.md'],
          handleEach: async ({ fullPath, fileNameWithoutExt }) => {
            const raw = (await fs.readFile(fullPath)).toString();
            const id = path.resolve(fullPath);
            const result = await markdown().transform(raw, id);
            return {
              fileName: `${fileNameWithoutExt}.vue`,
              content: result.code,
            };
          },
        },
      ],
    }),
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
