/* eslint-disable no-param-reassign */

'use strict';

const path = require('path');

const getModule = (name) => path.join('node_modules', name);

module.exports = (
  env,
  webpackConfig,
  { nativeModulesToTranspile = [], unshiftToRules = webpackConfig.module.rules } = {},
) => {
  if (!webpackConfig.resolve.extensions.includes('.web.ts')) {
    webpackConfig.resolve.extensions = webpackConfig.resolve.extensions.flatMap((ext) => [`.web${ext}`, ext]);
  }

  webpackConfig.resolve.alias = {
    ...webpackConfig.resolve.alias,
    'react-native$': 'react-native-web',
    '@storybook/react-native$': '@storybook/react',
    'styled-components$': 'styled-components/native',
  };

  const includeModulesThatContainPaths = [
    // copied from https://github.com/expo/expo-cli/blob/master/packages/webpack-config/src/loaders/createBabelLoader.ts
    getModule('react-native'),
    getModule('react-navigation'),
    getModule('expo'),
    getModule('unimodules'),
    getModule('@react'),
    getModule('@expo'),
    getModule('@use-expo'),
    getModule('@unimodules'),
    getModule('native-base'),
    // user-defined modules for
    ...nativeModulesToTranspile.map(getModule),
  ].map(path.normalize);

  const excludeModulesThatContainPaths = [getModule('react-native-web')];

  unshiftToRules.unshift({
    test: /\.(js|jsx|ts|tsx)$/,
    include: (inputPath) => {
      for (const possibleModule of includeModulesThatContainPaths) {
        if (inputPath.includes(possibleModule)) {
          return excludeModulesThatContainPaths.every((excludePath) => !inputPath.includes(excludePath));
        }
      }
      return false;
    },
    loaders: [
      {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
        },
      },
    ],
  });
};
