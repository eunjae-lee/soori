---
title: Examples
description: What can you build with Soori?
---

## Eject the output

A Soori plugin consists of `name`, `build`, and an optional `output` field.

```js
{
  build: ...,
  name: ...,
  output: {
    dir: 'src/generated/'
  }
}
```

By default `output.dir` is `node_modules/soori/submodules/<plugin-name>/`.
However, with config like above, the generated files will be located at
`<your-dir>/src/generated/`. You can either add this folder to `.gitignore` or
just commit it into your git repository. It's up to you.

## Typed library

```js
{
  build: ...,
  name: 'my-jsons',
  output: {
    packageExports: {
      import: './submodules/my-jsons/index.js',
      types: './submodules/my-jsons/types/index.d.ts',
    },
    // The config above injects the following code into `package.json`:
    /*
    "exports": {
      "./my-jsons": {
        "import": './submodules/my-jsons/index.js',
        "types": './submodules/my-jsons/types/index.d.ts',
      }
    }
    */


    // After all the build ends, the following code runs.
    onBuildEnd: async ({ dir, execaCommand }) => {
      // Convert *.ts to *.js
      await execaCommand(
        `npx -p typescript tsc *.ts --target es2020 --moduleResolution bundler`,
        {
          cwd: dir,
          shell: true,
        }
      );

      // Generate *.d.ts
      await execaCommand(
        `npx -p typescript tsc *.ts --declaration --emitDeclarationOnly --target es2020 --moduleResolution bundler --outDir types`,
        { cwd: dir, shell: true }
      );
    },
  },
}
```

[See the full code →](https://github.com/eunjae-lee/soori/tree/main/apps/demo-typedef)

## Virtual module

If you don't want a submodule like `soori/<something>`, then you could even
create a virtual module that doesn't exist in your `package.json`, but exists in
your `node_modules`.

```js
{
  ...
  output: {
    dir: 'node_modules/my-virtual-module',
    onBuildEnd: async ({ dir, execaCommand }) => {
      await fs.writeFile(
        `${dir}/package.json`,
        JSON.stringify(
          {
            name: 'my-virtual-module',
            private: true,
            type: 'module',
            main: 'dist/index.cjs',
            module: 'dist/index.mjs',
            types: 'dist/index.d.ts',
            exports: {
              '.': {
                import: './dist/index.mjs',
                require: './dist/index.cjs',
                types: './dist/index.d.ts',
              },
            },
          },
          null,
          2
        )
      );
      await execaCommand(`rm -rf src`);
      await execaCommand(`mkdir src`);
      await execaCommand(`cp *.ts src/`, { shell: true });
      await execaCommand(`npx unbuild`, {
        shell: true,
      });
    },
  },
}
```

Now you can import this library like the following:

```js
import { something } from 'my-virtual-module';
```

[See the full code →](https://github.com/eunjae-lee/soori/tree/main/apps/demo-virtual-module)
