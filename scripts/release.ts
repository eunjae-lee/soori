#!/usr/bin/env -S node_modules/.bin/tsx
// https://github.com/google/zx/issues/467#issuecomment-1577838056

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

console.log('Run the following command to publish:');
console.log('  > cd packages/soori && npm publish');
console.log('');
console.log('Run the following command to tag:');
console.log(
  `  > git tag ${name}@${version} && git push origin ${name}@${version}`
);
