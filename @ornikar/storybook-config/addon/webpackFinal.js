/* eslint-disable no-param-reassign */

'use strict';

const processEnv = require('@ornikar/webpack-config/processEnv');
const reactNativeWeb = require('@ornikar/webpack-config/reactNativeWeb');
const workspaceAliases = require('@ornikar/webpack-config/workspaceAliases');
const cssModulesRule = require('../webpack-configs/cssModulesRule');
const fixStorybookBabelRules = require('../webpack-configs/fixStorybookBabelRules');
const svgRule = require('../webpack-configs/svgRule');
const { defaultOptions } = require('./defaultOptions');

module.exports = (
  webpackConfig,
  {
    srcDirectory = './src',
    enableReactNativeWeb = false,
    enableLegacyCssModules = false,
    isCRAPresetEnabled = false,
    modulesToAlias = {},
    nativeModulesToTranspile = [],
    envVariables,
  } = defaultOptions,
) => {
  const env = process.env.NODE_ENV !== 'production' ? 'dev' : 'production';

  const { srcDirectories } = workspaceAliases(webpackConfig, { srcDirectory });

  if (enableLegacyCssModules) {
    cssModulesRule(env, webpackConfig, srcDirectories, isCRAPresetEnabled);
  }
  if (!isCRAPresetEnabled) {
    svgRule(env, webpackConfig);
  }
  fixStorybookBabelRules(env, webpackConfig);

  if (enableReactNativeWeb) {
    reactNativeWeb(env, webpackConfig, {
      nativeModulesToTranspile,
      unshiftToRules: webpackConfig.module.rules,
    });
  }

  webpackConfig.resolve.modules = ['node_modules', 'src'];

  processEnv(env, webpackConfig, {
    definitions: {
      // see rollup-config.
      __TARGET__: JSON.stringify('browser'),
    },
    envVariables,
  });

  webpackConfig.resolve.alias = {
    ...webpackConfig.resolve.alias,
    ...modulesToAlias,
  };

  // https://github.com/storybookjs/storybook/pull/19358
  // not backported yet to storybook 6
  webpackConfig.resolve.fallback.assert = require.resolve('browser-assert');

  return webpackConfig;
};
