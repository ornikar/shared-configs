'use strict';

const createBaseLintStagedConfig = require('@ornikar/repo-config/createLintStagedConfig');

module.exports = function createLintStagedConfig(options = {}) {
  const config = createBaseLintStagedConfig({ srcExtensions: ['js', 'ts', 'tsx'] });

  // eslint-disable-next-line prefer-destructuring
  const srcDirectories = createBaseLintStagedConfig.getSrcDirectories();

  Object.assign(config, {
    [`${srcDirectories}/**/*.module.css`]: (filenames) => ["tcm -s -p '**/*.module.css'", "git add '**/**.d.ts'"],
    '*.svg': ['svgo --multipass --config=node_modules/@ornikar/repo-config-react/.svgo.yml', 'git add'],
  });

  return config;
};
