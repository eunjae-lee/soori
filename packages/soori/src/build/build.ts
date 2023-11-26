import fs from 'node:fs/promises';
import path from 'node:path';
import { exists } from '../utils';
import { filterPluginsByChangedFile, loadConfig } from './config';
import { error } from '../utils/log';
import { runPlugins } from './runPlugins';
import { InternalPlugin } from '../types';

export const build = async ({
  cleanUp,
  changedFilePath,
  dryRun = false,
  cwd = process.cwd(),
}: {
  cleanUp: boolean;
  changedFilePath?: string;
  dryRun?: boolean;
  cwd?: string;
}) => {
  await prepareGeneratedPackageJson(cwd, cleanUp);

  let loadedConfig = await loadConfig(cwd);
  if (!loadedConfig.ok) {
    error(loadedConfig.error);
    process.exit(1);
  }

  const config = loadedConfig.data;
  const plugins = filterPluginsByChangedFile({
    plugins: config.plugins,
    changedFilename: changedFilePath?.slice(cwd.length + 1),
  });

  await prepareOutputDirs(cwd, cleanUp, plugins);
  await runPlugins({
    cwd,
    plugins,
    dryRun,
    changedFilePath,
  });
};

async function prepareOutputDirs(
  cwd: string,
  cleanUp: boolean,
  plugins: InternalPlugin[]
) {
  for (const plugin of plugins) {
    const dir = path.resolve(cwd, plugin.output.dir);
    if (await exists(dir)) {
      if (cleanUp) {
        await fs.rm(dir, { recursive: true, force: true });
        await fs.mkdir(dir, { recursive: true });
      }
    } else {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

async function prepareGeneratedPackageJson(cwd: string, cleanUp: boolean) {
  const src = path.resolve(cwd, 'node_modules', 'soori', 'package.json');
  const dest = path.resolve(
    cwd,
    'node_modules',
    'soori',
    'package.generated.json'
  );
  if (cleanUp || !(await exists(dest))) {
    await fs.cp(src, dest);
  }
}
