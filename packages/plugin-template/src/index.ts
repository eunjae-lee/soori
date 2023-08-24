import type { Plugin } from 'soori';
// import fs from 'node:fs/promises';
// import path from 'node:path';

type Options = {};

export default (_options?: Options) => {
  const plugin: Plugin = {
    name: 'plugin-template-RENAME-ME',
    build: [
      {
        handler: () => {
          return {
            fileName: 'index.js',
            content: 'export default "Hello World";',
          };
        },
      },
    ],
  };
  return plugin;
};
