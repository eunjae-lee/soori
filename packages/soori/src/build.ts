import chalk from 'chalk';
import { glob } from 'glob';
import { minimatch } from 'minimatch';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Build, BuildOutput, InternalConfig, Plugin } from './types';
import { exists } from './utils';

const GEN_PATH = `./node_modules/soori/submodules`;

// const primary = chalk.hex('#DE4500');

export const info = (message: string) => {
  console.log('[Soori]', chalk.cyan('[Info]'), message);
};
export const error = (message: string) => {
  console.log('[Soori]', chalk.bold.red('[ERROR]'), message);
};

export const resolveConfig = async (): Promise<InternalConfig> => {
  const files = await fs.readdir(process.cwd());
  const filename = [/*"soori.config.ts",*/ 'soori.config.js'].find((filename) =>
    files.includes(filename)
  );
  if (filename === undefined) {
    error(
      'Configuration missing. Create `soori.config.ts` or `soori.config.js`.'
    );
    process.exit(1);
  }

  let config = (await import(path.resolve(filename))).default;
  config.plugins.forEach((plugin: Plugin) => {
    if (!Array.isArray(plugin.build)) {
      plugin.build = [plugin.build];
    }
  });
  return config;
};

const filterConfigByChangedFile = (
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

const runBuild = async ({ name, build }: { name: string; build: Build }) => {
  if ('watch' in build) {
    const files = await glob(build.watch);
    await runBuildWithFiles({ name, build, files });
  } else {
    const output = await build.handler();
    await saveOutput(name, output);
  }
};

const runBuildWithFiles = async ({
  name,
  build,
  files,
}: {
  name: string;
  build: Build;
  files: string[];
}) => {
  for (const file of files) {
    const fileName = path.basename(file);
    const output = await build.handler({
      fullPath: file,
      fileName,
      fileNameWithoutExt: fileName.slice(0, fileName.lastIndexOf('.')),
    });
    await saveOutput(name, output);
  }
};

const saveOutput = async (name: string, output: BuildOutput) => {
  const { fileName, content } =
    typeof output === 'string'
      ? { fileName: 'index.js', content: output }
      : output;

  const fullFilePath = `${GEN_PATH}/${name}/${fileName}`;
  await fs.mkdir(path.dirname(fullFilePath), { recursive: true });
  await fs.writeFile(fullFilePath, content);
  info(`> Generated: ${fullFilePath}`);
};

export const build = async ({
  cleanUp,
  changedFilePath,
}: {
  cleanUp?: boolean;
  changedFilePath?: string;
}) => {
  if (cleanUp) {
    if (await exists(GEN_PATH)) {
      await fs.rm(GEN_PATH, { recursive: true, force: true });
    }
  }

  let config = await resolveConfig();
  if (changedFilePath) {
    config = filterConfigByChangedFile(config, changedFilePath);
  }

  for (const plugin of config.plugins) {
    const { build, name } = plugin;
    info(`Applying plugin \`${name}\`...`);
    for (const b of build) {
      if (changedFilePath) {
        await runBuildWithFiles({
          name,
          build: b,
          files: [changedFilePath],
        });
      } else {
        await runBuild({ name, build: b });
      }
    }
  }
};
