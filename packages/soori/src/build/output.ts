import fs from 'node:fs/promises';
import path from 'node:path';
import type { BuildOutput } from '../types';
import { info } from '../utils/log';

export const GEN_PATH = `./node_modules/soori/submodules`;

export const saveOutput = async ({
  name,
  output,
}: {
  name: string;
  output: BuildOutput;
}) => {
  const { fileName, content } = output;

  const fullFilePath = `${GEN_PATH}/${name}/${fileName}`;

  await fs.mkdir(path.dirname(fullFilePath), { recursive: true });
  await fs.writeFile(fullFilePath, content);
  info(`> Generated: ${fullFilePath}`);
};
