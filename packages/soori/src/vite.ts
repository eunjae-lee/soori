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
        if (filePath.startsWith(process.cwd())) {
          await build({
            changedFilePath: filePath.slice(process.cwd().length + 1),
          });
        } else {
          // don't know what to do, probably ignore it.
        }
      };

      server.watcher.on('add', listener);
      server.watcher.on('change', listener);
    },
  };
};
