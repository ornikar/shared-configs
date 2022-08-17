// see https://github.com/christophehurpeau/pob/blob/main/%40pob/root/bin/postinstall/install-husky.js

'use strict';

const fs = require('fs');
const path = require('path');
const husky = require('husky');
const semver = require('semver');
const { readYarnConfigFile } = require('../yarn');
const { phrasePrePush } = require('./phrase-pre-push');

const ensureLegacyHuskyConfigDeleted = () => {
  try {
    fs.unlinkSync(path.resolve('husky.config.js'));
  } catch {
    // if legacy husky.config.js doesn't exists, continue
  }
  try {
    fs.unlinkSync(path.resolve('.huskyrc'));
  } catch {
    // if legacy .huskyrc doesn't exists, continue
  }
};

const ensureHuskyNotInDevDependencies = (pkg) => {
  if (pkg.devDependencies && pkg.devDependencies.husky) {
    throw new Error('Found husky in devDependencies. Husky is provided by @ornikar/repo-config, please remove');
  }
};

const writeHook = (hookName, hookContent) => {
  fs.writeFileSync(
    path.resolve(`.husky/${hookName}`),
    `#!/usr/bin/env sh\n. "$(dirname "$0")/_/husky.sh"\n\n${hookContent.trim()}\n`,
    {
      mode: '755',
    },
  );
};

const ensureHookDeleted = (hookName) => {
  try {
    fs.unlinkSync(path.resolve(`.husky/${hookName}`));
  } catch {
    // if the hook doesn't exists, continue
  }
};

const getPackagesLocations = (pkg) => {
  const isMonorepo = !!pkg.workspaces;

  if (!isMonorepo) return ['.'];
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const { getSyncPackageLocations } = require('@ornikar/lerna-config');
  const packageLocations = getSyncPackageLocations(pkg.workspaces);
  return ['.', ...packageLocations];
};

module.exports = function installHusky({ pkg, pm }) {
  const yarnMajorVersion = pm.name === 'yarn' && semver.major(pm.version);
  const isYarnBerry = pm.name === 'yarn' && yarnMajorVersion >= 2;
  const isYarnPnp = isYarnBerry && !readYarnConfigFile().includes('nodeLinker: node-modules');

  /* Check legacy */

  ensureLegacyHuskyConfigDeleted();
  ensureHuskyNotInDevDependencies(pkg);

  /* Create Config */

  const shouldRunTest = () => pkg.scripts && pkg.scripts.test;
  const shouldRunChecks = () => pkg.scripts && pkg.scripts.checks;
  const shouldRunCleanCacheOnDependenciesChanges = () =>
    pkg.scripts && pkg.scripts['clean:cache:on-dependencies-changes'];

  try {
    fs.mkdirSync(path.resolve('.husky'));
  } catch {
    // if the directory already exists, continue
  }

  const pmExec = pm.name === 'npm' ? 'npx --no-install' : pm.name;

  writeHook('commit-msg', `${pmExec} commitlint --edit $1`);
  writeHook(
    'pre-commit',
    `${pmExec} ornikar-lint-staged${pkg.devDependencies && pkg.devDependencies.typescript ? ` && ${pmExec} tsc` : ''}`,
  );

  const runCleanCache = shouldRunCleanCacheOnDependenciesChanges();
  if (isYarnPnp && !runCleanCache) {
    ensureHookDeleted('post-checkout');
    ensureHookDeleted('post-merge');
    ensureHookDeleted('post-rewrite');
  } else {
    const runYarnInstallOnDiff = `
if [ -n "$(git diff HEAD@{1}..HEAD@{0} -- yarn.lock)" ]; then
  ${[
    // https://yarnpkg.com/features/zero-installs
    isYarnPnp
      ? ''
      : `yarn install ${
          isYarnBerry ? '--immutable --immutable-cache' : '--prefer-offline --pure-lockfile --ignore-optional'
        } || true`,
    runCleanCache ? `${pmExec} clean:cache:on-dependencies-changes` : '',
  ]
    .filter(Boolean)
    .join('\n  ')}
fi`;

    let postHookContent = runYarnInstallOnDiff;
    const packageLocations = getPackagesLocations(pkg);

    packageLocations.forEach((packageLocation) => {
      const cdToPackageLocation = packageLocation === '.' ? '' : `cd ${packageLocation}`;
      const cdToRoot = packageLocation === '.' ? '' : `cd ${path.relative(packageLocation, '.')}`;

      const gemfilePath = path.join(packageLocation, 'Gemfile.lock');
      if (fs.existsSync(gemfilePath)) {
        postHookContent += `
if [ -n "$(git diff HEAD@{1}..HEAD@{0} -- ${gemfilePath})" ]; then
  ${[cdToPackageLocation, 'bundle install --path vendor/bundle || true', cdToRoot].filter(Boolean).join('\n  ')}
fi
`;
      }

      const podfilePath = path.join(packageLocation, 'ios/Podfile.lock');
      if (fs.existsSync(podfilePath)) {
        postHookContent += `
if [ -n "$(git diff HEAD@{1}..HEAD@{0} -- ${podfilePath})" ]; then
  ${[cdToPackageLocation, 'yarn pod-install || true', cdToRoot].filter(Boolean).join('\n  ')}
fi
      `;
      }
    });
    writeHook('post-checkout', postHookContent);
    writeHook('post-merge', postHookContent);
    writeHook('post-rewrite', postHookContent);
  }

  const prePushHookPreCommands = [];
  const prePushHook = [];

  if (shouldRunTest()) {
    prePushHookPreCommands.push(
      '# autodetect main branch (usually master or main)',
      'mainBranch=$(LANG=en_US git remote show origin | grep "HEAD branch" | cut -d\' \' -f5)',
      '',
    );
    prePushHook.push(`CI=true ${pm.name} test --changedSince=origin/$mainBranch`);
  }

  if (shouldRunChecks()) {
    prePushHook.push(`${pm.name} run checks`);
  }

  if (prePushHook.length > 0) {
    let prePushHookPostContent = '';
    const phraseConfigPath = '.phrase.yml';
    if (fs.existsSync(phraseConfigPath)) {
      prePushHookPostContent += phrasePrePush;
    }

    writeHook(
      'pre-push',
      (prePushHookPreCommands ? [...prePushHookPreCommands, ''].join('\n') : '') +
        prePushHook.join(' && ') +
        prePushHookPostContent,
    );
  } else {
    ensureHookDeleted('pre-push');
  }

  // skip install husky on CI as we don't need it
  if (!process.env.CI) {
    husky.install('.husky');
  }
};
