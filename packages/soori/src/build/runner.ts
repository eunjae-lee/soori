import path from 'node:path';
import { glob } from 'glob';
import { execaCommand, type Options } from 'execa';
import type {
  Build,
  BuildOutputs,
  BuildPerEachFile,
  InternalPlugin,
} from '../types';
import { info } from '../utils/log';
import { saveOutput } from './output';
import { exists } from '../utils';
import fs from 'node:fs/promises';

const getExecaCommand = (dir: string) => {
  const cmd = (command: string, options: Options = {}) => {
    return execaCommand(command, {
      cwd: dir,
      ...options,
    });
  };
  return cmd as typeof execaCommand;
};

export const runPlugins = async ({
  plugins,
  dryOutput,
}: {
  plugins: InternalPlugin[];
  dryOutput: boolean;
}) => {
  let outputs: BuildOutputs = {};
  for (const plugin of plugins) {
    info(`Applying plugin \`${plugin.name}\`...`);
    await applyPackageExports(plugin);
    await plugin.output.onBuildStart?.({
      dir: plugin.output.dir,
      execaCommand: getExecaCommand(plugin.output.dir),
    });
    for (const build of plugin.build) {
      outputs = {
        ...outputs,
        ...(await runBuild({
          build,
          outputDir: plugin.output.dir,
          dryOutput,
        })),
      };
    }
    await plugin.output.onBuildEnd?.({
      dir: plugin.output.dir,
      execaCommand: getExecaCommand(plugin.output.dir),
    });
  }
  return outputs;
};

export const runPluginsPerEachFile = async ({
  plugins,
  files,
  dryOutput,
}: {
  plugins: InternalPlugin<BuildPerEachFile>[];
  files: string[];
  dryOutput: boolean;
}) => {
  let outputs: BuildOutputs = {};
  for (const plugin of plugins) {
    const { name } = plugin;
    info(`Applying plugin \`${name}\`...`);
    await applyPackageExports(plugin);
    await plugin.output.onBuildStart?.({
      dir: plugin.output.dir,
      execaCommand: getExecaCommand(plugin.output.dir),
    });
    for (const build of plugin.build) {
      outputs = {
        ...outputs,
        ...(await runBuildPerEachFile({
          build,
          files,
          outputDir: plugin.output.dir,
          dryOutput,
        })),
      };
    }
    await plugin.output.onBuildEnd?.({
      dir: plugin.output.dir,
      execaCommand: getExecaCommand(plugin.output.dir),
    });
  }
  return outputs;
};

export const runBuild = async ({
  build,
  outputDir,
  dryOutput,
}: {
  build: Build;
  outputDir: string;
  dryOutput: boolean;
}) => {
  let outputs: BuildOutputs = {};
  if ('handleEach' in build) {
    const files = await glob(build.watch);
    outputs = {
      ...outputs,
      ...(await runBuildPerEachFile({ build, files, dryOutput, outputDir })),
    };
  } else {
    const output = await build.handle();
    outputs[output.fileName] = output.content;
    if (!dryOutput) {
      await saveOutput({ outputDir, output });
    }
  }
  return outputs;
};

export const runBuildPerEachFile = async ({
  build,
  files,
  dryOutput,
  outputDir,
}: {
  build: BuildPerEachFile;
  files: string[];
  dryOutput: boolean;
  outputDir: string;
}) => {
  let outputs: BuildOutputs = {};
  for (const file of files) {
    const fileName = path.basename(file);
    const output = await build.handleEach({
      fullPath: path.resolve(file),
      fileName,
      fileNameWithoutExt: fileName.slice(0, fileName.lastIndexOf('.')),
    });
    outputs[output.fileName] = output.content;
    if (!dryOutput) {
      await saveOutput({ outputDir, output });
    }
  }
  return outputs;
};

export const applyPackageExports = async (plugin: InternalPlugin) => {
  if (!plugin.output.packageExports) {
    return;
  }
  const srcFilePath = `./node_modules/soori/package.json`;
  const destFilePath = `./node_modules/soori/package.generated.json`;
  if (!(await exists(destFilePath))) {
    await fs.cp(srcFilePath, destFilePath);
  }
  const pkg = JSON.parse((await fs.readFile(destFilePath)).toString());
  pkg.exports[`./${plugin.name}`] = plugin.output.packageExports;
  delete pkg.exports['./*'];
  pkg.exports['./*'] = {
    import: './submodules/*/index.js',
  };

  await fs.writeFile(destFilePath, JSON.stringify(pkg, null, 2));
};
