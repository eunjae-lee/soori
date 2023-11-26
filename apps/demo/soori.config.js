import { defineSooriConfig } from 'soori';
import json from '@soori/plugin-json';

export default defineSooriConfig({
  plugins: [
    json({
      output: 'json-gen',
      watch: ['src/jsons/*.json'],
      objectPerFile: true,
    }),
  ],
});
