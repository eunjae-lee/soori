import { runBuild, runPlugins } from 'soori';
import path from 'path';
import json from '../index';

describe('json', () => {
  it('runs plugins correctly', async () => {
    const outputs = await runBuild({
      name: 'test-build',
      build: {
        handler: () => {
          return {
            fileName: 'index.js',
            content: 'export const name = "Eunjae"',
          };
        },
      },
      outputMode: 'return-only',
    });

    expect(outputs).toMatchInlineSnapshot(`
      {
        "index.js": "export const name = \\"Eunjae\\"",
      }
    `);
  });

  it('generates jsons correctly', async () => {
    const outputs = await runPlugins({
      plugins: [
        json({
          watch: [path.resolve(__dirname, 'fixture1') + '/*.json'],
        }),
      ],
      outputMode: 'return-only',
    });
    expect(outputs).toMatchInlineSnapshot(`
      {
        "index.ts": "export * as test2 from './test2';
      export * as test1 from './test1';",
        "test1.ts": "export const hello = \\"world1\\";",
        "test2.ts": "export const hello = \\"world2\\";",
      }
    `);
  });

  it('generates nested jsons correctly', async () => {
    const outputs = await runPlugins({
      plugins: [
        json({
          watch: [path.resolve(__dirname, 'fixture2') + '/**/*.json'],
        }),
      ],
      outputMode: 'return-only',
    });
    expect(outputs).toMatchInlineSnapshot(`
      {
        "index.ts": "export * as test2 from './test2';
      export * as test1 from './test1';
      export * as test3 from './test3';",
        "test1.ts": "export const hello = \\"world1\\";",
        "test2.ts": "export const hello = \\"world2\\";",
        "test3.ts": "export const hello = \\"world3\\";",
      }
    `);
  });
});
