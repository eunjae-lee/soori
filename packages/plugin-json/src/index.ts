import { definePlugin } from 'soori';
import { glob } from 'glob';
import fs from 'node:fs/promises';
import path from 'node:path';

type Options = {
  name?: string;
  watch: string[];
  objectPerFile?: boolean;
};

export default (options: Options) =>
  definePlugin({
    name: options.name ?? 'json',
    build: [
      {
        watch: options.watch,
        handleEach: async ({ fullPath, fileNameWithoutExt }) => {
          const file = await fs.readFile(fullPath);
          const json = JSON.parse(file.toString());
          return {
            fileName: `${fileNameWithoutExt}.ts`,
            content: options.objectPerFile
              ? `export const ${fileNameWithoutExt} = ${JSON.stringify(
                json,
                null,
                2
              )}`
              : Object.keys(json)
                .map((key) => {
                  return `export const ${key} = ${JSON.stringify(
                    json[key]
                  )};`;
                })
                .join('\n\n'),
          };
        },
      },
      {
        watch: options.watch,
        handle: async () => {
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
                return options.objectPerFile
                  ? `export * from './${fileNameWithoutExt}'`
                  : `export * as ${fileNameWithoutExt} from './${fileNameWithoutExt}';`;
              })
              .join('\n'),
          };
        },
      },
    ],
  });
