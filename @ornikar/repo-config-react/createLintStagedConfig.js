'use strict';

const fs = require('fs');
const path = require('path');
const createBaseLintStagedConfig = require('@ornikar/repo-config/createLintStagedConfig');

const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));

module.exports = function createLintStagedConfig(options = {}) {
  const config = createBaseLintStagedConfig({ srcExtensions: ['js', 'mjs', 'ts', 'tsx'] });

  const srcDirectories = createBaseLintStagedConfig.getSrcDirectories();

  Object.assign(config, {
    '*.svg': ['svgo --multipass --config=node_modules/@ornikar/repo-config-react/.svgo.yml'],
  });

  if (pkg.devDependencies.typescript) {
    Object.assign(config, {
      [`${srcDirectories}/**/*.module.{css,css.d.ts}`]: (filenames) => ["tcm -s -p '**/*.module.css'"],
    });
  }

  return config;
};
