import path from 'node:path';
import { glob } from 'glob';
import type { Build, BuildOutputs, InternalPlugin, OutputMode } from '../types';
import { info } from '../utils/log';
import { saveOutput } from './output';

export const runPlugins = async ({
  plugins,
  outputMode,
}: {
  plugins: InternalPlugin[];
  outputMode: OutputMode;
}) => {
  console.log('# hey!');
  let outputs: BuildOutputs = {};
  for (const plugin of plugins) {
    const { name } = plugin;
    info(`Applying plugin \`${name}\`...`);
    for (const build of plugin.build) {
      outputs = {
        ...outputs,
        ...(await runBuild({ name, build, outputMode })),
      };
    }
  }
  return outputs;
};

export const runPluginsWithFiles = async ({
  plugins,
  files,
  outputMode,
}: {
  plugins: InternalPlugin[];
  files: string[];
  outputMode: OutputMode;
}) => {
  let outputs: BuildOutputs = {};
  for (const plugin of plugins) {
    const { name } = plugin;
    info(`Applying plugin \`${name}\`...`);
    for (const build of plugin.build) {
      outputs = {
        ...outputs,
        ...(await runBuildWithFiles({
          name,
          build,
          files,
          outputMode,
        })),
      };
    }
  }
  return outputs;
};

export const runBuild = async ({
  name,
  build,
  outputMode,
}: {
  name: string;
  build: Build;
  outputMode: OutputMode;
}) => {
  let outputs: BuildOutputs = {};
  if ('watch' in build) {
    const files = await glob(build.watch);
    outputs = {
      ...outputs,
      ...(await runBuildWithFiles({ name, build, files, outputMode })),
    };
  } else {
    const output = await build.handler();
    outputs[output.fileName] = output.content;
    if (outputMode === 'save-and-return') {
      await saveOutput({ name, output });
    }
  }
  return outputs;
};

export const runBuildWithFiles = async ({
  name,
  build,
  files,
  outputMode,
}: {
  name: string;
  build: Build;
  files: string[];
  outputMode: OutputMode;
}) => {
  let outputs: BuildOutputs = {};
  for (const file of files) {
    const fileName = path.basename(file);
    const output = await build.handler({
      fullPath: file,
      fileName,
      fileNameWithoutExt: fileName.slice(0, fileName.lastIndexOf('.')),
    });
    outputs[output.fileName] = output.content;
    if (outputMode === 'save-and-return') {
      await saveOutput({ name, output });
    }
  }
  return outputs;
};
