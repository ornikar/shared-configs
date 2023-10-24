'use strict';

const fs = require('node:fs');
const path = require('node:path');

const readYarnConfigFile = () => {
  try {
    return fs.readFileSync(path.resolve('.yarnrc.yml'));
  } catch {
    return '';
  }
};

exports.readYarnConfigFile = readYarnConfigFile;
