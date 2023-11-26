import { describe, it, expect } from 'vitest';
import { testPlugins } from '../../test';
import { Plugin } from '../../types';

const defaultPlugin: Plugin = {
  name: 'test-plugin',
  watch: ['some-folder/*'],
  output: 'test',
  build: ({ slug }) => ({
    id: slug,
    content: `export const ${slug} = true;`,
  }),
};

describe('runPlugins', () => {
  it('works with basic setup', async () => {
    const outputs = await testPlugins({
      listFiles: () => ['a.md', 'b.md', 'c.md'],
      plugins: [defaultPlugin],
    });
    expect(outputs).toMatchInlineSnapshot(`
      {
        "node_modules/soori/submodules/test/a.ts": "export const a = true;",
        "node_modules/soori/submodules/test/b.ts": "export const b = true;",
        "node_modules/soori/submodules/test/c.ts": "export const c = true;",
        "node_modules/soori/submodules/test/index.ts": "export * from './a'
      export * from './b'
      export * from './c'",
      }
    `);
  });

  it('emits individual files in .js', async () => {
    const outputs = await testPlugins({
      listFiles: () => ['a.md', 'b.md', 'c.md'],
      plugins: [
        {
          ...defaultPlugin,
          build: ({ slug }) => ({
            id: slug,
            content: `export const ${slug} = true;`,
            ext: 'js',
          }),
        },
      ],
    });
    expect(outputs['node_modules/soori/submodules/test/a.js']).toBeDefined();
    expect(outputs['node_modules/soori/submodules/test/b.js']).toBeDefined();
    expect(outputs['node_modules/soori/submodules/test/c.js']).toBeDefined();
  });

  it('emits entry file in .js', async () => {
    const outputs = await testPlugins({
      listFiles: () => ['a.md', 'b.md', 'c.md'],
      plugins: [
        {
          ...defaultPlugin,
          entry: {
            build: ({ filenamesWithoutExt }) => {
              return filenamesWithoutExt
                .map((filename) => `export * from './${filename}'`)
                .join('\n');
            },
            ext: 'js',
          },
        },
      ],
    });
    expect(
      outputs['node_modules/soori/submodules/test/index.js']
    ).toBeDefined();
  });
});
