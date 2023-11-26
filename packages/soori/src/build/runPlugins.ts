import path from 'node:path';
import { glob } from 'glob';
import { execaCommand } from 'execa';
import slugify from '@sindresorhus/slugify';
import type { InternalPlugin, BuildOutputs, MaybePromise } from '../types';
import { info } from '../utils/log';
import fs from 'node:fs/promises';

// const getExecaCommand = (dir: string) => {
//   const cmd = (command: string, options: Options = {}) => {
//     return execaCommand(command, {
//       cwd: dir,
//       ...options,
//     });
//   };
//   return cmd as typeof execaCommand;
// };

export const runPlugins = async ({
  cwd,
  plugins,
  dryRun,
  listFiles = ({ patterns, cwd }) => glob(patterns, { cwd }),
  changedFilePath,
}: {
  cwd: string;
  plugins: InternalPlugin[];
  dryRun: boolean;
  listFiles?: (params: {
    patterns: string[];
    cwd: string;
  }) => MaybePromise<string[]>;
  changedFilePath?: string;
}) => {
  const outputs: BuildOutputs = {};
  const saveOutput = async ({
    plugin,
    filename,
    content,
  }: {
    plugin: InternalPlugin;
    filename: string;
    content: string;
  }) => {
    const filePath = path.resolve(cwd, plugin.output.dir, filename);
    outputs[filePath] = content;

    if (!dryRun) {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, content);
      info(`> Generated: ${filePath}`);
    }
  };

  for (const plugin of plugins) {
    info(`Applying plugin \`${plugin.name}\`...`);
    await plugin.output.onBuildStart({
      name: plugin.output.name,
      dir: path.resolve(cwd, plugin.output.dir),
      dryRun,
      execaCommand,
    });

    const filePaths = (await listFiles({ patterns: plugin.watch, cwd })).map(
      (filename) => path.resolve(cwd, filename)
    );
    const filenames = filePaths.map((filePath) => path.basename(filePath));
    const filenamesWithoutExt = filenames.map((filename) => {
      const extname = path.extname(filename);
      return filename.slice(0, filename.length - extname.length);
    });
    await saveOutput({
      plugin,
      filename: `index.${plugin.entry.ext}`,
      content: plugin.entry.build({
        filePaths,
        filenames,
        filenamesWithoutExt,
      }),
    });

    for (const filePath of changedFilePath ? [changedFilePath] : filePaths) {
      const filename = path.basename(filePath);
      const ext = path.extname(filePath).slice(1);
      const filenameWithoutExt = filename.slice(
        0,
        filename.length - ext.length - 1
      );
      const slug = slugify(
        filePath.slice(
          cwd.endsWith('/') ? cwd.length : cwd.length + 1,
          filePath.length - ext.length - 1
        )
      );
      let outputs = await plugin.build({
        filePath,
        filename,
        filenameWithoutExt,
        slug,
        ext,
      });
      if (!outputs) {
        outputs = [];
      }
      if (!Array.isArray(outputs)) {
        outputs = [outputs];
      }
      for (const output of outputs) {
        await saveOutput({
          plugin,
          filename: `${output.id}.${output.ext ?? 'ts'}`,
          content: output.content,
        });
      }
    }

    await plugin.output.onBuildEnd({
      name: plugin.output.name,
      dir: path.resolve(cwd, plugin.output.dir),
      dryRun,
      execaCommand,
    });
  }

  return outputs;
};
