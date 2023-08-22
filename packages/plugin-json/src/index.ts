import type { Plugin } from 'soori';
import { glob } from 'glob';
import fs from 'node:fs/promises';
import path from 'node:path';

type Options = {
  name?: string;
  watch: string[];
};

export default (options: Options) => {
  const plugin: Plugin = {
    name: options.name ?? 'json',
    build: [
      {
        watch: options.watch,
        handler: async ({ fullPath, fileNameWithoutExt }) => {
          const file = await fs.readFile(fullPath);
          const json = JSON.parse(file.toString());
          return {
            fileName: `${fileNameWithoutExt}.ts`,
            content: Object.keys(json)
              .map((key) => {
                return `export const ${key} = ${JSON.stringify(json[key])};`;
              })
              .join('\n\n'),
          };
        },
      },
      {
        watch: options.watch,
        handler: async () => {
          const files = await glob(options.watch);
          return {
            fileName: 'index.ts',
            content: files
              .map((file) => {
                const basename = path.basename(file);
                const ext = path.extname(basename);
                const fileNameWithoutExt = basename.slice(
                  0,
                  basename.length - ext.length
                );
                return `export * as ${fileNameWithoutExt} from './${fileNameWithoutExt}';`;
              })
              .join('\n'),
          };
        },
      },
    ],
  };
  return plugin;
};
