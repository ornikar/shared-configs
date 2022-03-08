'use strict';

const fs = require('fs');
const path = require('path');

const readYarnConfigFile = () => {
  try {
    return fs.readFileSync(path.resolve('.yarnrc.yml'));
  } catch {
    return '';
  }
};

exports.readYarnConfigFile = readYarnConfigFile;
