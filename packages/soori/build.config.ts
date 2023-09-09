export default {
  entries: ['./src/index.ts', './src/cli.ts', './src/vite.ts'],
  declaration: true,
  externals: ['chalk', 'commander', 'glob', 'minimatch', 'vite', 'execa'],
  rollup: {
    emitCJS: true,
  },
};
