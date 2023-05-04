'use strict';

const webpack = require('webpack');

module.exports = (env, webpackConfig, { definitions = {}, envVariables = {}, stringifyEnvValue = true } = {}) => {
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      // make sure webpack don't "polyfill" process.env by setting and empty object
      process: {
        env: {},
      },
      // NOTE: process.env.NODE_ENV is defined by storybook and CRA5.
      'process.browser': true,
      'process.title': '"browser"',
      'process.version': 'null',
      __DEV__: env !== 'production',
      ...definitions,
      ...Object.fromEntries(
        Object.entries(envVariables)
          .filter(([key]) => key !== 'NODE_ENV')
          .map(([key, value]) => [`process.env.${key}`, stringifyEnvValue ? JSON.stringify(value) : value]),
      ),
    }),
  );
};
