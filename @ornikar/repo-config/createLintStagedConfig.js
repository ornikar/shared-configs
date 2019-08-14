'use strict';

const path = require('path');

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.resolve('package.json'));
const workspaces = pkg.workspaces || false;

const getSrcDirectories = (srcDirectoryName = 'src') =>
  workspaces ? `{${workspaces.join(',')}}${srcDirectoryName && `/${srcDirectoryName}`}` : srcDirectoryName;

module.exports = function createLintStagedConfig(options = {}) {
  const srcExtensions = options.srcExtensions || ['js'];
  const srcDirectories = getSrcDirectories(options.srcDirectoryName);
  const hasPrettier = pkg.devDependencies && pkg.devDependencies.prettier;
  const hasStyleLint = pkg.devDependencies && pkg.devDependencies.stylelint;
  const jsonFiles = `{.eslintrc.json,package.json${
    workspaces
      ? `,${workspaces.map((workspacePath) => `${workspacePath}/{.eslintrc.json,package.json}`).join(',')}`
      : ''
  }`;
  return {
    'yarn.lock': ['yarn-update-lock', 'git add'],
    [jsonFiles]: [hasPrettier && 'prettier --parser json --write', 'git add'].filter(Boolean),
    [`{.storybook,${srcDirectories}}/**/*.css`]: [
      hasPrettier && 'prettier --parser css --write',
      hasStyleLint && 'stylelint --quiet --fix',
      'git add',
    ].filter(Boolean),

    [`${srcDirectories}/**/*.{${srcExtensions.join(',')}}`]: ['eslint --fix --quiet', 'git add'],
    '{scripts,config,.storyboook}/*.js': ['eslint --fix --quiet', 'git add'],
  };
};

module.exports.srcDirectory = 'src';
module.exports.getSrcDirectories = getSrcDirectories;
