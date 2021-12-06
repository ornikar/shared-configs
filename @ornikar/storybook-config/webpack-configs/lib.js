/* eslint-disable filenames/match-exported, no-param-reassign */

'use strict';

const fs = require('fs');
const path = require('path');
const applyOrnikarStorybookBaseWebpackConfig = require('./base');

module.exports = function applyOrnikarStorybookLibWebpackConfig(config, packagesDir = '@ornikar') {
  applyOrnikarStorybookBaseWebpackConfig(config, packagesDir);

  fs.readdirSync(`./${packagesDir}`)
    .filter((packageName) => packageName !== '.DS_Store')
    .forEach((packageName) => {
      const basePath = path.resolve(`./${packagesDir}/${packageName}/src/index`);
      const isTs = fs.existsSync(path.resolve(`${basePath}.ts`));
      config.resolve.alias[`@ornikar/${packageName}$`] = path.resolve(`${basePath}.${isTs ? 'ts' : 'js'}`);
    });
};
