import { runPlugins } from '.';
import { Plugin } from '../types';

export const testPlugin = async (plugin: Plugin) => {
  return await runPlugins({
    plugins: [
      {
        outputDir: '',
        ...plugin,
        build: Array.isArray(plugin.build) ? plugin.build : [plugin.build],
      },
    ],
    dryOutput: true,
  });
};
