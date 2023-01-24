'use strict';

module.exports = (env, webpackConfig) => {
  webpackConfig.module.rules.push({
    test: /\.inline\.svg$/,
    exclude: /node_modules/,
    use: {
      loader: '@svgr/webpack',
      options: {
        svgo: false, // svg are optimized via lint-staged
      },
    },
  });
};
