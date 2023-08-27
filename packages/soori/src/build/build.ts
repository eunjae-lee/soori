import fs from 'node:fs/promises';
import { exists } from '../utils';
import { filterConfigByChangedFile, resolveConfig } from './config';
import { error } from '../utils/log';
import { runPlugins, runPluginsPerEachFile } from './runner';
import { GEN_PATH } from './output';
import { OutputMode } from '../types';

export const build = async ({
  cleanUp,
  changedFilePath,
  outputMode = 'save-and-return',
}: {
  cleanUp?: boolean;
  changedFilePath?: string;
  outputMode?: OutputMode;
}) => {
  if (cleanUp) {
    if (await exists(GEN_PATH)) {
      await fs.rm(GEN_PATH, { recursive: true, force: true });
    }
  }

  let resolveConfigResult = await resolveConfig();
  if (!resolveConfigResult.ok) {
    error(resolveConfigResult.error);
    process.exit(1);
  }
  const config = resolveConfigResult.data;

  if (changedFilePath) {
    return await runPluginsPerEachFile({
      plugins: filterConfigByChangedFile(config, changedFilePath).plugins,
      files: [changedFilePath],
      outputMode,
    });
  } else {
    return await runPlugins({
      plugins: config.plugins,
      outputMode,
    });
  }
};
