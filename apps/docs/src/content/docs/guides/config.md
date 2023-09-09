---
title: Configuration
description: How to write Soori config file
---

## First example

This is an example config:

```js title="soori.config.js"
// soori.config.js
import fs from 'node:fs/promises';

export default {
  plugins: [
    {
      name: 'ver',
      build: {
        handle: async () => {
          const { version } = JSON.parse(
            (await fs.readFile('package.json')).toString()
          );
          return {
            fileName: 'index.js',
            content: `export default ${version}`,
          };
        },
      },
    },
  ],
};
```

By `name: 'ver'`, this library will be accessible via `soori/ver`. Inside the
`handle` function, we're reading the `package.json` file and get the version out
of it. And `handle` function is supposed to return an object of `fileName` and
`content`. Then, file will be written into the following path:

> `node_modules/soori/submodules/ver/index.js`

## Watch

Let's assume you are using Soori with the vite plugin. What if you want to
automatically update this library when `package.json` file changes?

```js title="soori.config.js" ins={6}
// soori.config.js
plugins: [
  {
    name: 'ver',
    build: {
      watch: ['package.json'], // ← add this
      handle: async () => {
```

`build.watch` is an optional array of strings that contains file names to watch,
and triggers a build when any of it changes.

## Build each

As explained above, `build` can have `handle` and an optional `watch`. However,
there is more. The following is the type definition of `build`.

```ts
export type BuildAll = {
  watch?: string[];
  handle: () => BuildOutput | Promise<BuildOutput>;
};

export type BuildPerEachFile = {
  watch: string[];
  handleEach: (params: {
    fullPath: string;
    fileName: string;
    fileNameWithoutExt: string;
  }) => BuildOutput | Promise<BuildOutput>;
};

export type Build = BuildAll | BuildPerEachFile;
```

You can provide `watch` and `handleEach` for `build`, which runs `handleEach`
with the information of the individual file that is just added or changed. This
is useful to transform each file into something else.

## JSON transformer

Let's put everything together to convert a folder of json files into a library
of objects. By the way `build` can be either an object of an array of objects.

```js
const plugin = {
  name: 'json',
  build: [
    {
      watch: ['src/json/*.json'],
      handleEach: async ({ fullPath, fileNameWithoutExt }) => {
        // this converts each json file into a JavaScript file.
        // `src/json/hello.json`
        //    { "hello": "world" }
        //
        // becomes
        //
        // `node_modules/soori/submodules/json/hello.js`
        //    exports const a = { "hello": "world" }
        const file = await fs.readFile(fullPath);
        const json = JSON.parse(file.toString());
        return {
          fileName: `${fileNameWithoutExt}.ts`,
          content: `export const ${fileNameWithoutExt} = ${JSON.stringify(
            json,
            null,
            2
          )}`,
        };
      },
    },
    {
      watch: ['src/json/*.json'],
      handle: async () => {
        const files = await glob(['src/json/*.json']);
        // this writes an entry file like:
        // `node_modules/soori/submodules/json/index.ts`
        //    export * from './hello';
        //    export * from './hi';
        return {
          fileName: 'index.ts',
          content: files
            .map((file) => {
              const basename = path.basename(file);
              const ext = path.extname(basename);
              const fileNameWithoutExt = basename.slice(
                0,
                basename.length - ext.length
              );
              return `export * from './${fileNameWithoutExt}'`;
            })
            .join('\n'),
        };
      },
    },
  ],
};
```

This implementation is released under `@soori/plugin-json`.

```js
// soori.config.js
import { defineConfig } from 'soori';
import json from '@soori/plugin-json';

export default defineConfig({
  plugins: [json({ watch: ['src/jsons/*.json'] })],
});
```

And the output will be available via `soori/json` module. If you want to rename
it,

```js
// soori.config.js
import { defineConfig } from 'soori';
import json from '@soori/plugin-json';

export default defineConfig({
  plugins: [{ ...json({ watch: ['src/jsons/*.json'], name: 'custom-name' }})],
});
```

Just override the `name`, and you will get `soori/custom-name`.
