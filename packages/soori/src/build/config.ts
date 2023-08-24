import fs from 'node:fs/promises';
import path from 'node:path';
import { minimatch } from 'minimatch';
import type { Build, InternalConfig, Plugin, Result } from '../types';

export const resolveConfig = async (): Promise<Result<InternalConfig>> => {
  const files = await fs.readdir(process.cwd());
  const filename = [/*"soori.config.ts",*/ 'soori.config.js'].find((filename) =>
    files.includes(filename)
  );
  if (filename === undefined) {
    return {
      ok: false,
      error:
        'Configuration missing. Create `soori.config.ts` or `soori.config.js`.',
    };
  }

  let config = (await import(path.resolve(filename))).default;
  config.plugins.forEach((plugin: Plugin) => {
    if (!Array.isArray(plugin.build)) {
      plugin.build = [plugin.build];
    }
  });
  return {
    ok: true,
    data: config,
  };
};

export const filterConfigByChangedFile = (
  config: InternalConfig,
  changedFilePath: string
) => {
  const isMatchedBuild = (build: Build, changedFilePath: string) => {
    if ('watch' in build) {
      return build.watch.some((pattern) => minimatch(changedFilePath, pattern));
    } else {
      return false;
    }
  };

  let filteredConfig = {
    ...config,
    plugins: config.plugins
      .map((plugin) => {
        return {
          ...plugin,
          build: plugin.build.filter((b) => isMatchedBuild(b, changedFilePath)),
        };
      })
      .filter((plugin) => plugin.build.length > 0),
  };

  return filteredConfig;
};
