/* eslint-disable no-param-reassign */

'use strict';

/*
 * If you change something here, also change in @ornikar/jest-config-react-native customTransforms.js
 */

module.exports = (
  env,
  webpackConfig,
  { nativeModulesToTranspile = [], unshiftToRules = webpackConfig.module.rules, unshiftToOneOfRules } = {},
) => {
  if (!webpackConfig.resolve.extensions.includes('.web.ts')) {
    webpackConfig.resolve.extensions = webpackConfig.resolve.extensions.flatMap((ext) => [`.web${ext}`, ext]);
  }

  webpackConfig.resolve.alias = {
    ...webpackConfig.resolve.alias,
    'react-native$': 'react-native-web',
    '@storybook/react-native$': '@storybook/react',
  };

  const babelLoaderConfig = {
    loader: 'babel-loader',
    options: {
      babelrc: false,
      configFile: false,
      presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    },
  };

  const oneOf = [
    // problematic modules
    {
      test: /\.(js|jsx|ts|tsx)$/,
      // eslint-disable-next-line security/detect-non-literal-regexp
      include: new RegExp(
        `node_modules/(${[
          '@react-native-community/netinfo',
          'react-native-calendars',
          'react-native-reanimated',
          'native-base',
          ...nativeModulesToTranspile,
        ].join('|')})`,
      ),
      use: [babelLoaderConfig],
    },
    // native modules needing transpilation
    {
      test: /\.(js|jsx|ts|tsx)$/,
      include: /node_modules\/(@?react-native.*(?!web)|@?expo.*|@?react-navigation.*)\//,
      exclude: /node_modules\/.*\/(commonjs|modules|dist\/(modules|cjs|vendor))\//,
      use: [babelLoaderConfig],
    },
  ];

  if (unshiftToOneOfRules) {
    unshiftToOneOfRules.unshift(...oneOf);
  } else {
    unshiftToRules.unshift({ oneOf });
  }
};
