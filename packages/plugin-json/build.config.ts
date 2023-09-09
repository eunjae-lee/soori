export default {
  entries: ['./src/index.ts'],
  declaration: true,
  externals: ['vite', 'soori'],
  rollup: {
    emitCJS: true,
  },
};
