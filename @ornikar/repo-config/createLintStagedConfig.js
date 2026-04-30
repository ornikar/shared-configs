'use strict';

const fs = require('node:fs');
const path = require('node:path');

// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.resolve('package.json'));
const workspaces = pkg.workspaces || false;
const isLernaRepo = Boolean(pkg.devDependencies && pkg.devDependencies.lerna);
const hasTypescript = Boolean(pkg.devDependencies && pkg.devDependencies.typescript);
const hasDeprecatedStylelint = Boolean(pkg.devDependencies && pkg.devDependencies.stylelint);
const shouldGenerateTsconfigInLernaRepo = isLernaRepo && hasTypescript;
const shouldRunCheckPkgJSScript = fs.existsSync('./scripts/check-packagejson.js');
const shouldRunCheckPkgMJSScript = fs.existsSync('./scripts/check-packagejson.mjs');

const getSrcDirectories = (srcDirectoryName = 'src') =>
  workspaces
    ? `${workspaces.length === 1 ? workspaces[0] : `{${workspaces.join(',')}}`}${
        srcDirectoryName && `/${srcDirectoryName}`
      }`
    : srcDirectoryName;

module.exports = function createLintStagedConfig(options = {}) {
  const srcExtensions = options.srcExtensions || ['js', 'mjs', 'ts'];
  const srcDirectories = getSrcDirectories(options.srcDirectoryName);

  return {
    [`{yarn.lock,package.json${
      workspaces ? `,${workspaces.map((workspacePath) => `${workspacePath}/package.json`).join(',')}` : ''
    }}`]: (filenames) => {
      const packagejsonFilenames = filenames.filter((filename) => filename.endsWith('.json'));
      return [
        'yarn dedupe',
        packagejsonFilenames.length === 0 ? undefined : `prettier --write ${packagejsonFilenames.join(' ')}`,
        isLernaRepo && require.resolve('@ornikar/monorepo-config/bin/generate-eslintrc-files.mjs'),
        shouldGenerateTsconfigInLernaRepo &&
          require.resolve('@ornikar/monorepo-config/bin/generate-tsconfig-files.mjs'),
        shouldRunCheckPkgJSScript && 'node ./scripts/check-packagejson.js',
        shouldRunCheckPkgMJSScript && 'node ./scripts/check-packagejson.mjs',
        'git add yarn.lock .yarn',
      ].filter(Boolean);
    },
    '{.env*,!(package).json,*.{yml,yaml,md,html,env}}': ['prettier --write'],
    [`*.{${srcExtensions.join(',')}}`]: (filenames) => {
      if (filenames.length > 150) {
        return ['prettier --write .', 'eslint --fix --quiet .'];
      }
      return [`prettier --write -- ${filenames.join(' ')}`, `eslint --fix --quiet -- ${filenames.join(' ')}`];
    },
    [`{.storybook,${srcDirectories}}/**/*.css`]: [
      'prettier --parser css --write',
      hasDeprecatedStylelint ? 'stylelint --quiet --fix' : undefined,
    ].filter(Boolean),
    [`${srcDirectories}/**/*.{ts,tsx}`]: () => ['tsc'],
  };
};

module.exports.srcDirectory = 'src';
module.exports.getSrcDirectories = getSrcDirectories;
