import { defineConfig } from 'soori';
import json from '@soori/plugin-json';
import markdown from 'unplugin-vue-markdown/vite';
import path from 'node:path';
import fs from 'node:fs/promises';

const convertVitePluginToSoori = ({ name, watch, plugin, outputExtension }) => {
  return {
    name,
    build: {
      watch,
      handler: async ({ fullPath, fileNameWithoutExt }) => {
        const raw = (await fs.readFile(fullPath)).toString();
        const id = path.resolve(fullPath);
        const result = await plugin.transform(raw, id);
        return {
          fileName: `${fileNameWithoutExt}.${outputExtension}`,
          content: result.code,
        };
      },
    },
  };
};

export default defineConfig({
  plugins: [
    convertVitePluginToSoori({
      name: 'markdownInVue',
      watch: ['src/md/*.md'],
      plugin: markdown(),
      outputExtension: 'vue',
    }),
    {
      name: 'test',
      build: {
        handler: () => {
          return {
            fileName: 'index.js',
            content: 'export const name = "Eunjae"',
          };
        },
      },
    },
    json({ name: 'json-gen', watch: ['src/jsons/*.json'] }),
    // {
    //   name: 'json-gen',
    //   build: [
    //     {
    //       watch: ['src/jsons/*.json'],
    //       handler: async ({ fullPath, fileNameWithoutExt }) => {
    //         const file = await fs.readFile(fullPath);
    //         const json = JSON.parse(file.toString());
    //         return {
    //           fileName: `${fileNameWithoutExt}.ts`,
    //           content: `export default ${JSON.stringify(json)}`,
    //         };
    //       },
    //     },
    //     {
    //       watch: ['src/jsons/*.json'],
    //       handler: async () => {
    //         const files = await fs.readdir('src/jsons');
    //         return {
    //           fileName: 'index.ts',
    //           content: files
    //             .map((file) => {
    //               const fileNameWithoutExt = file.replace(/\.json$/, '');
    //               return `export { default as ${fileNameWithoutExt} } from './${fileNameWithoutExt}';`;
    //             })
    //             .join('\n'),
    //         };
    //       },
    //     },
    //   ],
    // },
  ],
});
