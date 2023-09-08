import { defineConfig, definePlugin } from 'soori';
import json from '@soori/plugin-json';

export default defineConfig({
  plugins: [
    definePlugin({
      outputMode: 'virtual-module',
      ...json({ name: 'json-gen', watch: ['src/jsons/*.json'] }),
    }),
  ],
});
