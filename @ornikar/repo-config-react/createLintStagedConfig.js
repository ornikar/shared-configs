'use strict';

const path = require('path');
const fs = require('fs');
const createBaseLintStagedConfig = require('@ornikar/repo-config/createLintStagedConfig');

const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));

module.exports = function createLintStagedConfig(options = {}) {
  const config = createBaseLintStagedConfig({ srcExtensions: ['js', 'mjs', 'ts', 'tsx'] });

  // eslint-disable-next-line prefer-destructuring
  const srcDirectories = createBaseLintStagedConfig.getSrcDirectories();

  Object.assign(config, {
    '*.svg': ['svgo --multipass --config=node_modules/@ornikar/repo-config-react/.svgo.yml', 'git add'],
  });

  if (pkg.devDependencies.typescript) {
    Object.assign(config, {
      [`${srcDirectories}/**/*.module.{css,css.d.ts}`]: (filenames) => [
        "tcm -s -p '**/*.module.css'",
        "git add '**/**.d.ts'",
      ],
    });
  }

  return config;
};
