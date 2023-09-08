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
  const cleanUpOutputDirs = async (plugins: InternalPlugin[]) => {
    if (!cleanUp) {
      return;
    }
    for (const plugin of plugins) {
      if (await exists(plugin.outputDir)) {
        await fs.rm(plugin.outputDir, { recursive: true, force: true });
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
    await cleanUpOutputDirs(plugins);
    return await runPluginsPerEachFile({
      plugins,
      files: [changedFilePath],
      dryOutput,
    });
  } else {
    await cleanUpOutputDirs(config.plugins);
    return await runPlugins({
      plugins: config.plugins,
      dryOutput,
    });
  }
};
