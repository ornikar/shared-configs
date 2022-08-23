'use strict';

// eslint-disable-next-line import/no-extraneous-dependencies
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  // should be identical to the config in @ornikar/webpack-configs/reactNativeWeb.js
  presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
  babelrc: false,
  configFile: false,
});
