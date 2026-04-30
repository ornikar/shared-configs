#!/usr/bin/env node

import { createRequire } from 'node:module';
import { cli } from '@lerna-lite/cli';
import versionCmd from '@lerna-lite/version/command';

const require = createRequire(import.meta.url);
const pkgLernaLiteCli = require('@lerna-lite/cli/package.json');

function main(argv) {
  const context = {
    lernaVersion: pkgLernaLiteCli.version,
  };

  return cli().command(versionCmd).parse(argv, context);
}

main(process.argv.slice(2));
