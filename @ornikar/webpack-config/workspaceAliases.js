'use strict';

const fs = require('node:fs');
const path = require('node:path');

module.exports = (webpackConfig, { srcDirectory = './src' } = {}) => {
  const workspaceAliases = {};
  let srcDirectories = [srcDirectory];

  // eslint-disable-next-line security/detect-non-literal-fs-filename
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
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const isTs = fs.existsSync(path.resolve(`${basePath}.ts`));
      workspaceAliases[`${name}$`] = path.resolve(`${basePath}.${isTs ? 'ts' : 'js'}`);
    });
  }

  // eslint-disable-next-line no-param-reassign
  webpackConfig.resolve.alias = {
    ...webpackConfig.resolve.alias,
    ...workspaceAliases,
  };

  return {
    srcDirectories,
  };
};
