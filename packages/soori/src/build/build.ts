import fs from 'node:fs/promises';
import { exists } from '../utils';
import { filterConfigByChangedFile, resolveConfig } from './config';
import { error } from '../utils/log';
import { runPlugins, runPluginsPerEachFile } from './runner';
import { InternalPlugin } from '../types';

export const build = async ({
  cleanUp,
  changedFilePath,
  dryOutput = false,
}: {
  cleanUp?: boolean;
  changedFilePath?: string;
  dryOutput?: boolean;
}) => {
  const prepareOutputDirs = async (plugins: InternalPlugin[]) => {
    for (const plugin of plugins) {
      if (await exists(plugin.output.dir)) {
        if (cleanUp) {
          await fs.rm(plugin.output.dir, { recursive: true, force: true });
          await fs.mkdir(plugin.output.dir, { recursive: true });
        }
      } else {
        await fs.mkdir(plugin.output.dir, { recursive: true });
      }
    }
  };

  let resolveConfigResult = await resolveConfig();
  if (!resolveConfigResult.ok) {
    error(resolveConfigResult.error);
    process.exit(1);
  }
  const config = resolveConfigResult.data;

  if (changedFilePath) {
    const plugins = filterConfigByChangedFile(config, changedFilePath).plugins;
    await prepareOutputDirs(plugins);
    return await runPluginsPerEachFile({
      plugins,
      files: [changedFilePath],
      dryOutput,
    });
  } else {
    await prepareOutputDirs(config.plugins);
    return await runPlugins({
      plugins: config.plugins,
      dryOutput,
    });
  }
};
