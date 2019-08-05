'use strict';

const path = require('path');
const createBaseHuskyConfig = require('@ornikar/repo-config/createHuskyConfig');

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.resolve('package.json'));

module.exports = function createHuskyConfig() {
  const config = createBaseHuskyConfig();
  if (pkg.devDependencies && pkg.devDependencies.typescript) {
    config.hooks['pre-commit'] += ' && yarn tsc';
  }
  return config;
};
