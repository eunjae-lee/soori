import path from 'node:path';
import { glob } from 'glob';
import type {
  Build,
  BuildOutputs,
  BuildPerEachFile,
  InternalPlugin,
} from '../types';
import { info } from '../utils/log';
import { saveOutput } from './output';

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
    await plugin.output.onBuildStart?.({ dir: plugin.output.dir });
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
    await plugin.output.onBuildEnd?.({ dir: plugin.output.dir });
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
    await plugin.output.onBuildStart?.({ dir: plugin.output.dir });
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
    await plugin.output.onBuildEnd?.({ dir: plugin.output.dir });
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
