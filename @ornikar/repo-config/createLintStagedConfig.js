'use strict';

const fs = require('fs');
const path = require('path');
const { readYarnConfigFile } = require('./lib/yarn');

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.resolve('package.json'));
const workspaces = pkg.workspaces || false;
const isLernaRepo = Boolean(pkg.devDependencies && pkg.devDependencies.lerna);
const hasTypescript = Boolean(pkg.devDependencies && pkg.devDependencies.typescript);
const shouldGenerateTsconfigInLernaRepo = isLernaRepo && hasTypescript;
const shouldRunCheckPkgScript = fs.existsSync('./scripts/check-packagejson.js');

const getSrcDirectories = (srcDirectoryName = 'src') =>
  workspaces
    ? `${workspaces.length === 1 ? workspaces[0] : `{${workspaces.join(',')}}`}${
        srcDirectoryName && `/${srcDirectoryName}`
      }`
    : srcDirectoryName;

module.exports = function createLintStagedConfig(options = {}) {
  const srcExtensions = options.srcExtensions || ['js', 'mjs', 'ts'];
  const srcDirectories = getSrcDirectories(options.srcDirectoryName);
  const yarnConfigFile = readYarnConfigFile();

  return {
    [`{yarn.lock,package.json${
      workspaces ? `,${workspaces.map((workspacePath) => `${workspacePath}/package.json`).join(',')}` : ''
    }}`]: (filenames) => {
      const packagejsonFilenames = filenames.filter((filename) => filename.endsWith('.json'));
      return [
        ...(yarnConfigFile
          ? ['yarn dedupe']
          : ['yarn --prefer-offline', 'yarn-deduplicate -s fewer', 'yarn-deduplicate', 'yarn --prefer-offline']),
        packagejsonFilenames.length === 0 ? undefined : `prettier --write ${packagejsonFilenames.join(' ')}`,
        isLernaRepo && require.resolve('@ornikar/lerna-config/bin/generate-eslintrc-files.js'),
        shouldGenerateTsconfigInLernaRepo && require.resolve('@ornikar/lerna-config/bin/generate-tsconfig-files.js'),
        shouldRunCheckPkgScript && 'node ./scripts/check-packagejson.js',
        `git add yarn.lock${yarnConfigFile ? ' .yarn' : ''}`,
      ].filter(Boolean);
    },
    '{.env*,!(package).json,*.{yml,yaml,md,html,env}}': ['prettier --write'],
    [`*.{${srcExtensions.join(',')}}`]: ['prettier --write', 'eslint --fix --quiet'],
    [`{.storybook,${srcDirectories}}/**/*.css`]: ['prettier --parser css --write', 'stylelint --quiet --fix'],
  };
};

module.exports.srcDirectory = 'src';
module.exports.getSrcDirectories = getSrcDirectories;
