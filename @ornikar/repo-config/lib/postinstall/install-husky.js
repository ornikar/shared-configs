/* eslint-disable filenames/match-exported */
// see https://github.com/christophehurpeau/pob/blob/main/%40pob/root/bin/postinstall/install-husky.js

'use strict';

const fs = require('fs');
const path = require('path');
const husky = require('husky');
const semver = require('semver');

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
  fs.writeFileSync(path.resolve(`.husky/${hookName}`), `${hookContent}\n`, {
    mode: '755',
  });
};

const ensureHookDeleted = (hookName) => {
  try {
    fs.unlinkSync(path.resolve(`.husky/${hookName}`));
  } catch {
    // if the hook doesn't exists, continue
  }
};

const readYarnConfigFile = () => {
  try {
    return fs.readFileSync(path.resolve('.yarnrc.yml'));
  } catch {
    return '';
  }
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
  const shouldRunCleanCache = () => pkg.scripts && pkg.scripts['clean:cache'];

  try {
    fs.mkdirSync(path.resolve('.husky'));
  } catch {
    // if the directory already exists, continue
  }

  const pmExec = pm.name === 'npm' ? 'npx --no-install' : pm.name;

  writeHook('commit-msg', `${pmExec} commitlint --edit $1`);
  writeHook(
    'pre-commit',
    `${pmExec} lint-staged -r${pkg.devDependencies && pkg.devDependencies.typescript ? ` && ${pmExec} tsc` : ''}`,
  );

  const runCleanCache = shouldRunCleanCache();
  if (isYarnPnp && !runCleanCache) {
    ensureHookDeleted('post-checkout');
    ensureHookDeleted('post-merge');
    ensureHookDeleted('post-rewrite');
  } else {
    const runYarnInstallOnDiff = `
if [ -n "$(git diff HEAD@{1}..HEAD@{0} -- yarn.lock)" ]; then
  ${
    isYarnPnp
      ? ''
      : `yarn install ${
          isYarnBerry ? '--immutable --immutable-cache' : '--prefer-offline --pure-lockfile --ignore-optional'
        } || true`
  }
  ${runCleanCache ? `${pmExec} clean:cache` : ''}
fi`;

    // https://yarnpkg.com/features/zero-installs
    writeHook('post-checkout', runYarnInstallOnDiff);
    writeHook('post-merge', runYarnInstallOnDiff);
    writeHook('post-rewrite', runYarnInstallOnDiff);
  }

  const prePushHook = [];

  if (shouldRunTest()) {
    prePushHook.push(`CI=true ${pm.name} test`);
  }

  if (shouldRunChecks()) {
    prePushHook.push(`${pm.name} run checks`);
  }

  if (prePushHook.length > 0) {
    writeHook('pre-push', prePushHook.join(' && '));
  } else {
    ensureHookDeleted('pre-push');
  }

  husky.install('.husky');
};