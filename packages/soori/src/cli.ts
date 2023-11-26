import { Command } from 'commander';
import { description, version } from '../package.json';
import { build } from './build';

const createProgram = () => {
  const program = new Command();
  program.name('Soori').description(description).version(version);

  program
    .command('build')
    .option('--no-clean', 'Do not clean the output directory')
    .option('-D, --dry-run', 'Dry run')
    .action(async (_, options) => {
      await build({
        cleanUp: !options.noClean,
        dryRun: Boolean(options.dryRun),
      });
    });

  return program;
};

export const main = () => {
  const program = createProgram();
  program.parse();
};
