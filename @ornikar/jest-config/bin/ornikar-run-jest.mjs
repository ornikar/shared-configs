#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { lt } from 'semver';

const nodeVersion = process.versions.node;

if (lt(nodeVersion, '21.1.0')) {
  console.warn(
    `WARNING: Use node version >= 21.1.0 to fix issue with jest. Actual: ${nodeVersion}. For more information, see https://github.com/jestjs/jest/issues/11956\n\n`,
  );
  spawnSync(
    process.execPath,
    [...process.execArgv, '--no-compilation-cache', 'node_modules/jest/bin/jest.js', ...process.argv.slice(2)],
    {
      stdio: 'inherit',
    },
  );
} else {
  if (process.env.NODE_ENV == null) {
    process.env.NODE_ENV = 'test';
  }
  import('jest').then((module) => module.default.run());
}
