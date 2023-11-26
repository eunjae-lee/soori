import path from 'node:path';
import fs from 'node:fs/promises';
import { PluginOutput } from '../types';
import { build } from 'unbuild';

type Submodule = (params: { name: string; ext: string }) => PluginOutput;

export const submodule: Submodule = ({ name, ext }) => ({
  name,
  dir: path.resolve('node_modules', 'soori', 'submodules', name),
  onBuildStart: async ({ name, dryRun }) => {
    if (dryRun) {
      return;
    }
    const packageJsonPath = path.resolve(
      'node_modules',
      'soori',
      'package.generated.json'
    );
    const pkg = JSON.parse((await fs.readFile(packageJsonPath)).toString());
    if (ext === 'ts') {
      pkg.exports[`./${name}`] = {
        import: `./submodules/${name}/dist/index.mjs`,
        require: `./submodules/${name}/dist/index.cjs`,
        types: `./submodules/${name}/dist/index.d.ts`,
      };
    } else {
      pkg.exports[`./${name}`] = {
        import: `./submodules/${name}/index.${ext}`,
      };
    }
    await fs.writeFile(packageJsonPath, JSON.stringify(pkg, null, 2));
  },
  onBuildEnd: async ({ dryRun, dir }) => {
    if (dryRun) {
      return;
    }
    if (ext === 'ts') {
      await build(dir, false, {
        entries: ['./index.ts'],
        declaration: true,
        rollup: {
          emitCJS: true,
        },
      });
    }
  },
});

// export const virtualModule: OutputHelper = (name: string) => ({
//   name,

// });
