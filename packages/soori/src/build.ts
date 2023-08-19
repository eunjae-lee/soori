import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "./types";
import { exists } from "./utils";

const GEN_PATH = "./node_modules/soori/submodules";

export const error = (message: string) => {
  console.error("[ERROR]", message);
};

export const readConfig = async () => {
  const files = await fs.readdir(process.cwd());
  const filename = [/*"soori.config.ts",*/ "soori.config.js"].find((filename) =>
    files.includes(filename)
  );
  if (filename === undefined) {
    error(
      "Configuration missing. Create `soori.config.ts` or `soori.config.js`.",
    );
    process.exit(1);
  }
  const config = (await import(path.resolve(filename))).default;
  return config;
};

const runPlugin = async ({ build, output }: Plugin) => {
  const content = await build();
  if (output.type === "eject") {
    await fs.writeFile(output.path, content);
  } else if (output.type === "submodule") {
    await fs.mkdir(`${GEN_PATH}/${output.name}`);
    await fs.writeFile(`${GEN_PATH}/${output.name}/index.js`, content);
  }
};

const prepareSubmoduleFolder = async () => {
  if (await exists(GEN_PATH)) {
    await fs.rm(GEN_PATH, { recursive: true, force: true });
  }
  await fs.mkdir(GEN_PATH, { recursive: true });
};

export const build = async () => {
  await prepareSubmoduleFolder();

  const config = await readConfig();
  await Promise.allSettled(config.plugins.map(runPlugin));
};
