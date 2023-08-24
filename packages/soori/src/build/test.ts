import { runPlugins } from '.';
import { Plugin } from '../types';

export const testPlugin = async (plugin: Plugin) => {
  return await runPlugins({
    plugins: [
      {
        ...plugin,
        build: Array.isArray(plugin.build) ? plugin.build : [plugin.build],
      },
    ],
    outputMode: 'return-only',
  });
};
