'use strict';

const fs = require('node:fs');
const path = require('node:path');
const createBaseLintStagedConfig = require('@ornikar/repo-config/createLintStagedConfig');

const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json')));

module.exports = function createLintStagedConfig(options = {}) {
  const config = createBaseLintStagedConfig({ srcExtensions: ['js', 'mjs', 'ts', 'tsx'], ...options });

  const srcDirectories = createBaseLintStagedConfig.getSrcDirectories(options.srcDirectoryName);

  Object.assign(config, {
    '*.svg': ['svgo --config=node_modules/@ornikar/repo-config-react/svgo.config.js'],
  });

  if (pkg.devDependencies.typescript) {
    Object.assign(config, {
      [`${srcDirectories}/**/*.module.{css,css.d.ts}`]: (filenames) => ["tcm -s -p '**/*.module.css'"],
    });
  }

  return config;
};

module.exports.getSrcDirectories = createBaseLintStagedConfig.getSrcDirectories;
