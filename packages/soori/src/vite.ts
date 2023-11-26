import type { Plugin } from 'vite';

import { build } from './build';

export const soori = (): Plugin => {
  return {
    name: 'vite-plugin-soori',
    buildStart: async () => {
      await build({ cleanUp: true });
    },
    configureServer: (server) => {
      const listener = async (filePath: string) => {
        await build({
          cleanUp: false,
          changedFilePath: filePath,
        });
      };

      server.watcher.on('add', listener);
      server.watcher.on('change', listener);
    },
  };
};
