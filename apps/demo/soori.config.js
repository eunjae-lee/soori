import fs from "fs/promises";
import { defineConfig } from "soori";

export default defineConfig({
  plugins: [
    {
      output: {
        type: "eject",
        path: "src/soori.js",
      },
      build: async () => {
        const file = await fs.readFile("package.json");
        const pkg = JSON.parse(file.toString());
        return `export const ver = ${JSON.stringify(pkg.version)};\n`;
      },
    },
    {
      output: {
        type: "submodule",
        name: "test",
      },
      build: () => {
        return 'export const name = "Eunjae"';
      },
    },
  ],
});
