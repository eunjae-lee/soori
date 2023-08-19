import fs from 'fs/promises';

export default {
  plugins: [
    {
      output: {
        type: 'eject', // | 'submodule'
        path: 'src/soori.js'
      },
      build: async () => {
        const file = await fs.readFile("package.json");
        const pkg = JSON.parse(file.toString())
        return `export const ver = ${JSON.stringify(pkg.version)};\n`
      }
    }
  ]
}
