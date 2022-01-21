/* eslint-disable no-param-reassign, filenames/match-exported, unicorn/no-unsafe-regex */

'use strict';

const path = require('path');
// webpack is a peer dependency, and we don't want to install it as dev dependency in this repo.
const resolveFields = require('@ornikar/webpack-config/resolveFields');
const webpack = require('webpack');

module.exports = function applyOrnikarStorybookBaseWebpackConfig(config, srcDir, { enableLinaria = false } = {}) {
  // storybook defines mainFields, we want to override them
  delete config.resolve.mainFields;
  resolveFields(process.env.NODE_ENV !== 'production' ? 'dev' : 'production', config);

  const cssRule = config.module.rules.find((rule) => rule.test && rule.test.toString() === /\.css$/.toString());
  cssRule.exclude = /\.module\.css$/;
  cssRule.sideEffects = true;

  const imageRule = config.module.rules.find(
    (rule) =>
      rule.test &&
      rule.test.toString() ===
        /\.(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/.toString(),
  );
  imageRule.exclude = /\.inline\.svg$/;

  config.module.rules.push({
    test: /\.module\.css$/,
    loaders: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: '[local]__[hash:base64:5]',
          },
          importLoaders: 2,
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
    include: path.resolve(`./${srcDir}`),
  });

  config.module.rules.push({
    test: /\.inline\.svg$/,
    exclude: /node_modules/,
    use: {
      loader: require.resolve('svg-react-loader'),
    },
  });

  if (enableLinaria) {
    config.module.rules.push({
      test: /\.(ts|js|tsx|jsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('@linaria/webpack-loader'),
          options: {
            sourceMap: process.env.NODE_ENV !== 'production',
            extension: '.css',
            babelOptions: {
              presets: ['@babel/preset-typescript'],
            },
          },
        },
      ],
    });
  }

  config.resolve.modules = ['node_modules', 'src'];

  config.resolve.alias['@storybook/react-native$'] = '@storybook/react';
  config.resolve.alias['styled-components$'] = 'styled-components/native';

  if (!config.resolve.extensions.includes('.web.js')) {
    config.resolve.extensions = config.resolve.extensions.flatMap((ext) => [`.web${ext}`, ext]);
  }

  config.plugins.push(
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      __TARGET__: JSON.stringify('browser'),
    }),
  );
};
