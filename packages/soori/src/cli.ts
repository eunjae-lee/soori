import { Command } from "commander";
import { description, version } from "../package.json";
import { build } from "./build";

const createProgram = () => {
  const program = new Command();
  program.name("Soori").description(description).version(version);

  program.command("build")
    .description("build desc")
    .action(() => {
      build();
    });

  return program;
};

export const main = () => {
  const program = createProgram();
  program.parse();
};
