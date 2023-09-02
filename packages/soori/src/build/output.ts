import fs from 'node:fs/promises';
import path from 'node:path';
import type { BuildOutput } from '../types';
import { info } from '../utils/log';

export const saveOutput = async ({
  outputDir,
  output,
}: {
  outputDir: string;
  output: BuildOutput;
}) => {
  const { fileName, content } = output;
  const fullFilePath = path.resolve(outputDir, fileName);
  await fs.mkdir(path.dirname(fullFilePath), { recursive: true });
  await fs.writeFile(fullFilePath, content);
  info(`> Generated: ${fullFilePath}`);
};
