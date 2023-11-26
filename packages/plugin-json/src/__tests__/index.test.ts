import { testPlugins } from 'soori';
import path from 'node:path';
import json from '..';

describe('json', () => {
  it('exports all from json files', async () => {
    const outputs = await testPlugins({
      plugins: [
        json({
          output: 'test-plugin',
          watch: [path.resolve(__dirname, 'fixture1') + '/*.json'],
        }),
      ],
    });
    expect(outputs).toMatchInlineSnapshot(`
      {
        "node_modules/soori/submodules/test-plugin/index.ts": "export * from './test2';

      export * from './test1';",
        "node_modules/soori/submodules/test-plugin/test1.ts": "export const hello = \\"world1\\";",
        "node_modules/soori/submodules/test-plugin/test2.ts": "export const hello = \\"world2\\";",
      }
    `);
  });

  it('exports as each module from json files', async () => {
    const outputs = await testPlugins({
      plugins: [
        json({
          output: 'test-plugin',
          watch: [path.resolve(__dirname, 'fixture1') + '/*.json'],
          objectPerFile: true,
        }),
      ],
    });
    const entry = outputs['node_modules/soori/submodules/test-plugin/index.ts'];
    expect(entry).toContain('export * as test1');
    expect(entry).toContain('export * as test2');
  });
});
