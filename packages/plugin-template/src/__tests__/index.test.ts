import { testPlugin } from 'soori';
import plugin from '..';

describe('json', () => {
  it('runs plugins correctly', async () => {
    expect(await testPlugin(plugin())).toMatchInlineSnapshot(`
      {
        "index.js": "export default \\"Hello World\\";",
      }
    `);
  });
});
