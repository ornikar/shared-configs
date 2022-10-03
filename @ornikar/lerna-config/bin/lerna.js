#!/usr/bin/env node

'use strict';

const cli = require('@lerna/cli');
const pkgLernaCli = require('@lerna/cli/package.json');
const publishCmd = require('@lerna/publish/command');
const versionCmd = require('@lerna/version/command');

function main(argv) {
  const context = {
    lernaVersion: pkgLernaCli.version,
  };

  return cli().command(publishCmd).command(versionCmd).parse(argv, context);
}

main(process.argv.slice(2));
