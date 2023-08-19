import fs from "node:fs/promises";
import path from "node:path";

type Output = {
  type: "eject";
  path: string;
} | { type: "submodule" };

type Plugin = {
  output: Output;
  build: () => Promise<string>;
};

export const error = (message: string) => {
  console.error("[ERROR]", message);
};

export const readConfig = async () => {
  const files = await fs.readdir(process.cwd());
  const filename = [/*"soori.config.ts",*/ "soori.config.js"].find((filename) =>
    files.includes(filename)
  );
  if (filename === undefined) {
    error("`soori.config.ts` or `soori.config.js` is not found.");
    process.exit(1);
  }
  const config = (await import(path.resolve(filename))).default;
  return config;
};

const runPlugin = async ({ build, output }: Plugin) => {
  const content = await build();
  if (output.type === "eject") {
    await fs.writeFile(output.path, content);
  }
};

export const build = async () => {
  const config = await readConfig();
  await Promise.allSettled(config.plugins.map(runPlugin));
};
