import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['./src/index.ts'],
  declaration: true,
  externals: ['vite', 'soori'],
  rollup: {
    emitCJS: true,
  },
});
