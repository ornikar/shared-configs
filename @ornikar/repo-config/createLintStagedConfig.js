'use strict';

const path = require('path');

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.resolve('package.json'));
const workspaces = pkg.workspaces || false;
const isLernaRepo = Boolean(pkg.devDependencies && pkg.devDependencies.lerna);
const hasTypescript = Boolean(pkg.devDependencies && pkg.devDependencies.typescript);
const shouldGenerateTsconfigInLernaRepo = isLernaRepo && hasTypescript;

const getSrcDirectories = (srcDirectoryName = 'src') =>
  workspaces ? `{${workspaces.join(',')}}${srcDirectoryName && `/${srcDirectoryName}`}` : srcDirectoryName;

module.exports = function createLintStagedConfig(options = {}) {
  const srcExtensions = options.srcExtensions || ['js', 'mjs', 'ts'];
  const srcDirectories = getSrcDirectories(options.srcDirectoryName);

  return {
    [`{yarn.lock,package.json${
      workspaces ? `,${workspaces.map((workspacePath) => `${workspacePath}/package.json`).join(',')}` : ''
    }}`]: (filenames) => {
      const packagejsonFilenames = filenames.filter((filename) => filename.endsWith('.json'));
      return [
        'yarn --prefer-offline',
        'yarn-deduplicate',
        'yarn --prefer-offline',
        packagejsonFilenames.length === 0 ? undefined : `prettier --write ${packagejsonFilenames.join(' ')}`,
        'git add yarn.lock',
        // eslint-disable-next-line node/no-extraneous-require
        shouldGenerateTsconfigInLernaRepo && require.resolve('@ornikar/lerna-config/generate-tsconfig-files.js'),
        shouldGenerateTsconfigInLernaRepo && 'prettier --write **/tsconfig.json **/tsconfig.build.json',
        shouldGenerateTsconfigInLernaRepo && 'git add **/tsconfig.json **/tsconfig.build.json',
      ].filter(Boolean);
    },
    '!(package).json': ['prettier --write'],
    '*.{yml,yaml,md,html}': ['prettier --write'],
    [`*.{${srcExtensions.join(',')}}`]: ['prettier --write', 'eslint --fix --quiet'],
    [`{.storybook,${srcDirectories}}/**/*.css`]: ['prettier --parser css --write', 'stylelint --quiet --fix'],
  };
};

module.exports.srcDirectory = 'src';
module.exports.getSrcDirectories = getSrcDirectories;
