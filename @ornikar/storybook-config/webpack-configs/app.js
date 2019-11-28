/* eslint-disable filenames/match-exported */

'use strict';

const applyOrnikarStorybookBaseWebpackConfig = require('./base');

module.exports = function applyOrnikarStorybookAppWebpackConfig(config, srcDir = 'src') {
  applyOrnikarStorybookBaseWebpackConfig(config, srcDir);
};
