#!/usr/bin/env zx
import { $ } from 'zx';
import fs from 'fs/promises';

await $`cd packages/soori && npx changelogen@latest --bump`;
await $`cp packages/soori/CHANGELOG.md .`;

const { name, version } = JSON.parse(
  (await fs.readFile('packages/soori/package.json')).toString()
);
await $`pnpm install`;
await $`pnpm run build:lib`;
await $`git add . && git commit -m "chore(${name}): release v${version}"`;
await $`cd packages/soori && npm publish`;
