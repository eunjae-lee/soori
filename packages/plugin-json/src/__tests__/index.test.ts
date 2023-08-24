import { runBuild } from 'soori';

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
      [
        {
          "content": "export const name = \\"Eunjae\\"",
          "fileName": "index.js",
        },
      ]
    `);
  });
});
