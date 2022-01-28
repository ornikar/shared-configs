'use strict';

module.exports = (env, webpackConfig) => {
  webpackConfig.module.rules.push({
    test: /\.raw.svg$/,
    exclude: [/node_modules/],
    use: {
      loader: 'raw-loader',
    },
  });
};
