import fs from "fs/promises";
import { defineConfig } from "soori";

export default defineConfig({
  plugins: [
    {
      name: "test",
      build: {
        handler: () => {
          return 'export const name = "Eunjae"';
        },
      },
    },
    {
      name: "json-gen",
      build: [
        {
          watch: ["src/jsons/*.json"],
          handler: async ({ fullPath, fileNameWithoutExt }) => {
            const file = await fs.readFile(fullPath);
            const json = JSON.parse(file.toString());
            return {
              fileName: `${fileNameWithoutExt}.ts`,
              content: `export default ${JSON.stringify(json)}`,
            };
          },
        },
        {
          watch: ["src/jsons/*.json"],
          handler: async () => {
            const files = await fs.readdir("src/jsons");
            return {
              fileName: "index.ts",
              content: files
                .map((file) => {
                  const fileNameWithoutExt = file.replace(/\.json$/, "");
                  return `export { default as ${fileNameWithoutExt} } from './${fileNameWithoutExt}';`;
                })
                .join("\n"),
            };
          },
        },
      ],
    },
  ],
});
