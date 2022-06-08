/* eslint-disable global-require, import/no-dynamic-require */

'use strict';

const fs = require('fs');
const path = require('path');
const rootPkg = require('../package.json');

const packagesDir = '@ornikar';

const packages = fs
  .readdirSync(path.resolve(`./${packagesDir}`))
  .filter((name) => name !== '.DS_Store' && !name.startsWith('.eslintrc'));

let hasError = false;

/* ensure same versions than root */

packages.forEach((pkgName) => {
  const pkg = require(`${packagesDir}/${pkgName}/package.json`);
  Object.keys(rootPkg.devDependencies).forEach((dep) => {
    if (dep === 'jest') return;
    const expected = rootPkg.devDependencies[dep];
    if (pkg.devDependencies && pkg.devDependencies[dep] && pkg.devDependencies[dep] !== expected) {
      console.error(`${pkgName}: dev dependency ${dep} is ${pkg.devDependencies[dep]}, expected ${expected}`);
      hasError = true;
    }
  });
});

if (hasError) {
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}
