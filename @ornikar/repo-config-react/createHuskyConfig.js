'use strict';

const createBaseHuskyConfig = require('@ornikar/repo-config/createHuskyConfig');

module.exports = function createHuskyConfig() {
  const config = createBaseHuskyConfig();
  config.hooks['pre-commit'] += ' && yarn tsc';
  return config;
};
