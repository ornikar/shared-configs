'use strict';

const path = require('path');
const createBaseLintStagedConfig = require('@ornikar/repo-config/createLintStagedConfig');

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.resolve('package.json'));

module.exports = function createLintStagedConfig(options = {}) {
  const config = createBaseLintStagedConfig({ srcExtensions: ['js', 'ts', 'tsx'] });

  // eslint-disable-next-line prefer-destructuring
  const srcDirectories = createBaseLintStagedConfig.getSrcDirectories();

  const additionalConfig = {
    '*.svg': ['svgo --multipass --config=node_modules/@ornikar/repo-config-react/.svgo.yml', 'git add'],
  };
  if (pkg.devDependencies.typescript) {
    additionalConfig[`${srcDirectories}/**/*.module.{css,css.d.ts}`] = (filenames) => [
      "tcm -s -p '**/*.module.css'",
      "git add '**/**.d.ts'",
    ];
  }

  Object.assign(config, additionalConfig);

  return config;
};
