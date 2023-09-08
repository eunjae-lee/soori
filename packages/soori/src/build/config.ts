import fs from 'node:fs/promises';
import path from 'node:path';
import { minimatch } from 'minimatch';
import type {
  Build,
  BuildPerEachFile,
  InternalConfig,
  Plugin,
  Result,
} from '../types';

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
    const pluginOutputDir = `./node_modules/soori/submodules/${plugin.name}`;
    if (!plugin.output) {
      plugin.output = {};
    }
    plugin.output.dir = path.resolve(plugin.output.dir ?? pluginOutputDir);

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
): InternalConfig<BuildPerEachFile> => {
  const isMatchedBuild = (build: Build): build is BuildPerEachFile => {
    if ('handleEach' in build) {
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
          build: plugin.build.filter(isMatchedBuild),
        };
      })
      .filter((plugin) => plugin.build.length > 0),
  };

  return filteredConfig;
};
