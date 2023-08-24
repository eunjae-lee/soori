import { testPlugin } from 'soori';
import path from 'node:path';
import json from '..';

describe('json', () => {
  it('runs plugins correctly', async () => {
    const outputs = await testPlugin({
      name: 'test-plugin',
      build: {
        handler: () => {
          return {
            fileName: 'index.js',
            content: 'export const name = "Eunjae"',
          };
        },
      },
    });
    expect(outputs).toMatchInlineSnapshot(`
      {
        "index.js": "export const name = \\"Eunjae\\"",
      }
    `);
  });

  it('generates jsons correctly', async () => {
    const outputs = await testPlugin(
      json({
        watch: [path.resolve(__dirname, 'fixture1') + '/*.json'],
      })
    );
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
    const outputs = await testPlugin(
      json({
        watch: [path.resolve(__dirname, 'fixture2') + '/**/*.json'],
      })
    );
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
