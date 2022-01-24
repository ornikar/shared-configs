/* eslint-disable no-param-reassign */

'use strict';

const fs = require('fs');
const path = require('path');
const linaria = require('@ornikar/webpack-config/linaria');
const processEnv = require('@ornikar/webpack-config/processEnv');
const resolveFields = require('@ornikar/webpack-config/resolveFields');
const cssModulesRule = require('../webpack-configs/cssModulesRule');
const reactNativeWeb = require('../webpack-configs/reactNativeWeb');
const svgRule = require('../webpack-configs/svgRule');
const { defaultOptions } = require('./defaultOptions');

module.exports = (
  webpackConfig,
  {
    srcDirectory = './src',
    enableReactNativeWeb = false,
    enableLinaria = false,
    modulesToAlias = [],
    nativeModulesToTranspile = [],
    envVariables,
  } = defaultOptions,
) => {
  const workspaceAliases = {};
  let srcDirectories = [srcDirectory];

  const pkg = JSON.parse(fs.readFileSync(path.resolve('./package.json')));

  if (pkg.workspaces) {
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    const { getSyncPackages } = require('@ornikar/lerna-config');

    srcDirectories = [];

    const packages = getSyncPackages(pkg.workspaces);
    packages.forEach(({ name, location }) => {
      const packageSrcDirectory = path.join(`./${location}`, srcDirectory);
      const basePath = path.join(packageSrcDirectory, './index');
      srcDirectories.push(packageSrcDirectory);
      const isTs = fs.existsSync(path.resolve(`${basePath}.ts`));
      workspaceAliases[`${name}$`] = path.resolve(`${basePath}.${isTs ? 'ts' : 'js'}`);
    });
  }

  const env = process.env.NODE_ENV !== 'production' ? 'dev' : 'production';

  resolveFields(env, webpackConfig);
  cssModulesRule(env, webpackConfig, srcDirectories);
  svgRule(env, webpackConfig);

  if (enableLinaria) {
    linaria(env, webpackConfig);
  }

  if (enableReactNativeWeb) {
    reactNativeWeb(env, webpackConfig, { nativeModulesToTranspile });
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
    ...workspaceAliases,
    ...modulesToAlias,
  };

  return webpackConfig;
};
