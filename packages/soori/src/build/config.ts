import { loadConfig as _loadConfig } from 'c12';
import { minimatch } from 'minimatch';
import type { Config, InternalConfig, InternalPlugin, Result } from '../types';
import { submodule } from './output';

export const loadConfig = async (
  cwd: string
): Promise<Result<InternalConfig>> => {
  const { config } = await _loadConfig<Config>({
    cwd,
    name: 'soori',
  });
  if (!config) {
    return {
      ok: false,
      error: 'Configuration missing. Create `soori.config.js`.',
    };
  }

  return {
    ok: true,
    data: resolveConfig(config),
  };
};

export const resolveConfig = (config: Config) => {
  const internalConfig: InternalConfig = {
    plugins: config.plugins.map((plugin) => {
      const entry =
        typeof plugin.entry === 'function'
          ? { build: plugin.entry, ext: 'ts' }
          : {
              build:
                plugin.entry?.build ??
                (({
                  filenamesWithoutExt,
                }: {
                  filenames: string[];
                  filenamesWithoutExt: string[];
                }) => {
                  return filenamesWithoutExt
                    .map(
                      (filenameWithoutExt) =>
                        `export * from './${filenameWithoutExt}'`
                    )
                    .join('\n');
                }),
              ext: plugin.entry?.ext ?? 'ts',
            };
      const output =
        typeof plugin.output === 'string'
          ? submodule({ name: plugin.output, ext: entry.ext })
          : plugin.output;

      return {
        ...plugin,
        entry,
        output,
      };
    }),
  };

  return internalConfig;
};

export const filterPluginsByChangedFile = ({
  plugins,
  changedFilename,
}: {
  plugins: InternalPlugin[];
  changedFilename?: string;
}) => {
  if (!changedFilename) {
    return plugins;
  }

  return plugins.filter((plugin) =>
    plugin.watch.some((pattern) => minimatch(changedFilename, pattern))
  );
};
