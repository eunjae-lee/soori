import { defineSooriPlugin } from 'soori';
import fs from 'node:fs/promises';

type Options = {
  output: string;
  watch: string[];
  objectPerFile?: boolean;
};

export default ({ output, watch, objectPerFile }: Options) =>
  defineSooriPlugin({
    name: '@soori/plugin-json',
    watch,
    output,
    build: async ({ filePath, filenameWithoutExt }) => {
      try {
        const json = JSON.parse((await fs.readFile(filePath)).toString());
        return {
          id: filenameWithoutExt,
          content: Object.keys(json)
            .map((key) => `export const ${key} = ${JSON.stringify(json[key])};`)
            .join('\n\n'),
        };
      } catch (err) {
        return;
      }
    },
    entry: ({ filenamesWithoutExt }) => {
      if (objectPerFile) {
        return filenamesWithoutExt
          .map((filename) => `export * as ${filename} from './${filename}';`)
          .join('\n\n');
      } else {
        return filenamesWithoutExt
          .map((filename) => `export * from './${filename}';`)
          .join('\n\n');
      }
    },
  });
