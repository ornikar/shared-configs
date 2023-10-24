'use strict';

const fs = require('node:fs');
const path = require('node:path');
const createBaseLintStagedConfig = require('@ornikar/repo-config-react/createLintStagedConfig');

const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json')));

module.exports = function createLintStagedConfig(options = {}) {
  const config = createBaseLintStagedConfig(options);

  const srcDirectories = createBaseLintStagedConfig.getSrcDirectories(options.srcDirectoryName);

  if (pkg.devDependencies.typescript) {
    Object.assign(config, {
      [`${srcDirectories}/**/*.module.{css,css.d.ts}`]: (filenames) => ["tcm -s -p '**/*.module.css'"],
    });
  }

  return config;
};

module.exports.getSrcDirectories = createBaseLintStagedConfig.getSrcDirectories;
