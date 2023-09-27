#!/usr/bin/env node

'use strict';

const path = require('node:path');
const pkg = require('@commitlint/cli/package.json');

// eslint-disable-next-line import/no-dynamic-require
require(path.join('@commitlint/cli', typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.commitlint));
