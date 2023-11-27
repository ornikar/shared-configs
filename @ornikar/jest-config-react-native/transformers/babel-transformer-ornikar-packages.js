'use strict';

// eslint-disable-next-line import/no-extraneous-dependencies
const babelJest = require('babel-jest').default;

module.exports = babelJest.createTransformer({
  plugins: ['react-native-reanimated/plugin'],
  babelrc: false,
  configFile: false,
});
