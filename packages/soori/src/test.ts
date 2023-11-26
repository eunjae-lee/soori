import { runPlugins, resolveConfig } from './build';
import { BuildOutputs, Plugin } from './types';

type Params = Omit<
  Parameters<typeof runPlugins>[0],
  'cwd' | 'dryRun' | 'plugins'
> & {
  cwd?: string;
  plugins: Plugin[];
};

export const testPlugins = async ({
  cwd = process.cwd(),
  plugins,
  changedFilePath,
  listFiles,
}: Params) => {
  const config = resolveConfig({
    plugins,
  });

  const outputs = await runPlugins({
    cwd,
    plugins: config.plugins,
    changedFilePath,
    listFiles,
    dryRun: true,
  });

  return simplifyOutputs({ outputs, cwd });
};

export const simplifyOutputs = ({
  outputs,
  cwd,
}: {
  outputs: BuildOutputs;
  cwd: string;
}) =>
  Object.keys(outputs).reduce<BuildOutputs>((acc, filePath) => {
    acc[filePath.slice(cwd.endsWith('/') ? cwd.length : cwd.length + 1)] =
      outputs[filePath];
    return acc;
  }, {});
