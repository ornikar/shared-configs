#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const whichPmRuns = require('which-pm-runs');

if (!process.env.INIT_CWD) {
  console.error('Missing process.env.INIT_CWD. Did you use postinstall script ?');
  process.exit(1);
}

process.chdir(process.env.PROJECT_CWD || process.env.INIT_CWD);

const pm = whichPmRuns();

if (!pm) {
  console.error('Invalid package manager, please run with postinstall hook!');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json')));

require('../lib/postinstall/install-husky')({ pkg, pm });
require('../lib/postinstall/update-nvmrc')();
