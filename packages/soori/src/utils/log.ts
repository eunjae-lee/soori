import chalk from 'chalk';

// const primary = chalk.hex('#DE4500');

export const info = (message: string) => {
  console.log('[Soori]', chalk.cyan('[Info]'), message);
};

export const error = (message: string) => {
  console.log('[Soori]', chalk.bold.red('[ERROR]'), message);
};
