#!/usr/bin/env node

'use strict';

const fs = require('fs').promises;
const path = require('path');
const prettyEslintConfig = require('@pob/pretty-eslint-config');
const { createLernaProject, getPackages, readJsonFile } = require('..');

const overrideConfig = (config, override) => {
  return { ...config, ...override };
};

const overrideAndWriteConfig = async (configPath, prettierOptions, { override, callback, removeRules }) => {
  let config = await readJsonFile(configPath, {});
  config = overrideConfig(config, override);

  if (config.rules && removeRules) {
    for (const rule of removeRules) {
      delete config.rules[rule];
    }
  }

  if (callback) {
    config = callback(config);
  }

  if (config.rules && Object.keys(config.rules).length === 0) {
    delete config.rules;
  }

  await fs.writeFile(configPath, prettyEslintConfig(config, prettierOptions));
};

const generateAndWriteRootConfig = async (configPath, prettierOptions) => {
  await overrideAndWriteConfig(configPath, prettierOptions, {
    override: {
      root: true,
      extends: ['@ornikar/eslint-config/root'],
    },
    removeRules: ['import/no-extraneous-dependencies'],
  });
};

const generateAndWritePackageConfig = async (configPath, prettierOptions, { packagePath, useRollupToBuild }) => {
  if (!useRollupToBuild) {
    await overrideAndWriteConfig(configPath, prettierOptions, {
      override: {
        root: true,
        extends: ['@ornikar/eslint-config', '@ornikar/eslint-config/node'],
      },
      removeRules: ['import/no-extraneous-dependencies'],
    });
  } else {
    await overrideAndWriteConfig(configPath, prettierOptions, {
      override: {
        root: true,

        parser: '@typescript-eslint/parser',
        parserOptions: {
          project: `${packagePath}/tsconfig.json`,
        },
      },
      callback: (configParam) => {
        const config = { ...configParam };
        if (!config.extends) config.extends = [];
        if (config.extends.includes('@ornikar/eslint-config-typescript-react')) {
          if (config.extends.includes('@ornikar/eslint-config-typescript')) {
            config.extends = config.extends.filter(config => config !== '@ornikar/eslint-config-typescript');
          }
        } else if (!config.extends.includes('@ornikar/eslint-config-typescript')) {
          config.extends = ['@ornikar/eslint-config-typescript', ...config.extends];
        }
        if (!config.extends.includes('@ornikar/eslint-config/rollup')) {
          config.extends = [...config.extends, '@ornikar/eslint-config/rollup'];
        }

        if (!config.settings) config.settings = {};

        config.settings['import/resolver'] = {
          node: {
            moduleDirectory: ['node_modules', 'src'],
          },
        };

        return config;
      },
      removeRules: ['import/no-extraneous-dependencies'],
    });
  }
};

(async () => {
  const rootPath = path.resolve('.');
  const lernaProject = createLernaProject(rootPath);
  const lernaPackages = await getPackages(lernaProject);
  const prettierConfig = lernaProject.manifest.get('prettier');
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const prettierOptions = require(prettierConfig.startsWith('./') ? path.resolve(prettierConfig) : prettierConfig);
  const eslintRootConfigPath = `${rootPath}/.eslintrc.json`;

  const useRollupToBuild = lernaProject.manifest.devDependencies['@ornikar/rollup-config'] !== undefined;

  await Promise.all([
    generateAndWriteRootConfig(eslintRootConfigPath, prettierOptions),

    ...lernaProject.packageParentDirs.map((parentDir) =>
      Promise.all([
        fs.unlink(`${parentDir}/.eslintrc.js`).catch(() => {}),
        fs.unlink(`${parentDir}/.eslintrc.project.json`).catch(() => {}),
      ]),
    ),
    ...lernaPackages.map(async (pkg) => {
      if (!pkg.get('main')) return;
      const packagePath = path.relative(rootPath, pkg.location);
      const eslintSrcConfigPath = useRollupToBuild
        ? `${packagePath}/src/.eslintrc.json`
        : `${packagePath}/.eslintrc.json`;

      await Promise.all([
        useRollupToBuild ? fs.unlink(`${packagePath}/.eslintrc.json`).catch(() => {}) : undefined,
        fs.unlink(`${packagePath}/.eslintrc.js`).catch(() => {}),
        generateAndWritePackageConfig(eslintSrcConfigPath, prettierOptions, { packagePath, useRollupToBuild }),
      ]);
    }),
  ]);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
