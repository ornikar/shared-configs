'use strict';

const webpack = require('webpack');

module.exports = (env, webpackConfig, { definitions = {}, envVariables = {} } = {}) => {
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.browser': true,
      'process.title': '"browser"',
      __DEV__: env !== 'production',
      ...definitions,
      ...Object.fromEntries(Object.entries(envVariables).map(([key, value]) => [`process.env.${key}`, value])),
    }),

    // make sure webpack don't "polyfill" process.env by setting and empty object
    new webpack.DefinePlugin({ process: { env: {} } }),
  );
};
