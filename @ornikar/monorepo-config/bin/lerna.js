#!/usr/bin/env node

'use strict';

const cli = require('@lerna/cli');
const pkgLernaCli = require('@lerna/cli/package.json');
const versionCmd = require('@lerna/version/dist/index');

function main(argv) {
  const context = {
    lernaVersion: pkgLernaCli.version,
  };

  return cli().command(versionCmd).parse(argv, context);
}

main(process.argv.slice(2));
