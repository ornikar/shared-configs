'use strict';

const path = require('path');

module.exports = (env, webpackConfig, srcDirectories) => {
  const cssRule = webpackConfig.module.rules.find((rule) => rule.test && rule.test.toString() === /\.css$/.toString());
  cssRule.exclude = /\.module\.css$/;
  cssRule.sideEffects = true;

  webpackConfig.module.rules.push({
    test: /\.module\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: '[local]__[hash:base64:5]',
          },
          importLoaders: process.env.NODE_ENV !== 'production' ? 2 : 1,
        },
      },
      process.env.NODE_ENV !== 'production' && require.resolve('@chrp/typed-css-modules-loader'),
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            config: path.resolve('./.storybook/postcss.config.js'),
          },
        },
      },
    ].filter(Boolean),
    include: srcDirectories.map((srcPath) => path.resolve(srcPath)),
  });
};
