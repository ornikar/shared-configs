/* eslint-disable no-param-reassign, filenames/match-exported, unicorn/no-unsafe-regex */

'use strict';

const path = require('path');
// webpack is a peer dependency, and we don't want to install it as dev dependency in this repo.
// eslint-disable-next-line import/no-unresolved
const webpack = require('webpack');
const resolveFields = require('@ornikar/webpack-config/resolveFields');

module.exports = function applyOrnikarStorybookBaseWebpackConfig(config, srcDir) {
  resolveFields(process.env.NODE_ENV !== 'production' ? 'dev' : 'production', config);

  const cssRule = config.module.rules.find((rule) => rule.test.toString() === /\.css$/.toString());
  cssRule.exclude = /\.module\.css$/;
  cssRule.sideEffects = true;

  const imageRule = config.module.rules.find(
    (rule) =>
      rule.test.toString() ===
      /\.(svg|ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/.toString(),
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
      require.resolve('@chrp/typed-css-modules-loader'),
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: path.resolve('./.storybook/postcss.config'),
          },
        },
      },
    ],
    include: path.resolve(`./${srcDir}`),
  });

  config.module.rules.push({
    test: /\.inline\.svg$/,
    exclude: /node_modules/,
    use: {
      loader: require.resolve('svg-react-loader'),
    },
  });

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    exclude: [path.resolve('node_modules')],
    loaders: [
      {
        loader: 'babel-loader',
        options: {
          babelrc: true,
        },
      },
    ],
  });

  config.resolve.extensions = ['.js', '.jsx', '.tsx', '.ts'];
  config.resolve.modules = ['node_modules', 'src'];

  config.plugins.push(
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      __TARGET__: JSON.stringify('browser'),
    }),
  );
};
