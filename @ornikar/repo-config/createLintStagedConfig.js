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

  return {
    [`{yarn.lock,package.json${
      workspaces ? `,${workspaces.map((workspacePath) => `${workspacePath}/package.json`).join(',')}` : ''
    }}`]: (filenames) => ['yarn-update-lock', 'git add yarn.lock'],
    [`{.eslintrc.json,package.json${
      workspaces
        ? `,${workspaces.map((workspacePath) => `${workspacePath}/{.eslintrc.json,package.json}`).join(',')}`
        : ''
    }}`]: ['prettier --parser json --write', 'git add'],
    [`{.storybook,${srcDirectories}}/**/*.css`]: [
      'prettier --parser css --write',
      'stylelint --quiet --fix',
      'git add',
    ],

    [`${srcDirectories}/**/*.{${srcExtensions.join(',')}}`]: ['eslint --fix --quiet', 'git add'],
    '{scripts,config,.storyboook}/*.js': ['eslint --fix --quiet', 'git add'],
  };
};

module.exports.srcDirectory = 'src';
module.exports.getSrcDirectories = getSrcDirectories;
