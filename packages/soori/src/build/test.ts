import { runPlugins } from '.';
import { Plugin } from '../types';

export const testPlugin = async (plugin: Plugin) => {
  return await runPlugins({
    plugins: [
      {
        ...plugin,
        output: { dir: plugin.output?.dir ?? '', ...plugin.output },
        build: Array.isArray(plugin.build) ? plugin.build : [plugin.build],
      },
    ],
    dryOutput: true,
  });
};
