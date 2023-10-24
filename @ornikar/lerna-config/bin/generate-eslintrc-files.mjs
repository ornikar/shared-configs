#!/usr/bin/env node

import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import prettyEslintConfig from '@pob/pretty-eslint-config';
import { createLernaProject, getPackages, readJsonFile } from '../index.mjs';

const overrideConfig = (config, override) => {
  return { ...config, ...override };
};

const overrideAndWriteConfig = async (configPath, prettierOptions, { override, callback, removeRules, allowKeys }) => {
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

  if (allowKeys) {
    for (const key of Object.keys(config)) {
      if (!allowKeys.includes(key)) {
        delete config[key];
      }
    }
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

const generateAndWritePackageSourceConfig = async (configPath, prettierOptions, { packagePath, useRollupToBuild }) => {
  if (!useRollupToBuild) {
    await overrideAndWriteConfig(configPath, prettierOptions, {
      override: {
        root: true,
        extends: ['@ornikar/eslint-config/node'],
      },
      removeRules: ['import/no-extraneous-dependencies'],
    });
  } else {
    await overrideAndWriteConfig(configPath, prettierOptions, {
      override: {
        root: true,

        parser: '@typescript-eslint/parser',
        parserOptions: {
          project: `${packagePath}/tsconfig.eslint.json`,
        },
      },
      callback: (configParam) => {
        const config = { ...configParam };
        if (!config.extends) config.extends = [];
        if (config.extends.includes('@ornikar/eslint-config-typescript-react')) {
          if (config.extends.includes('@ornikar/eslint-config-typescript')) {
            config.extends = config.extends.filter((c) => c !== '@ornikar/eslint-config-typescript');
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

const generateAndWritePackageRootConfig = async (configPath, prettierOptions) => {
  await overrideAndWriteConfig(configPath, prettierOptions, {
    override: {
      root: false,
    },
    allowKeys: ['root', 'ignorePatterns'],
  });
};

(async () => {
  const require = createRequire(import.meta.url);
  const rootPath = path.resolve('.');
  const lernaProject = createLernaProject(rootPath);
  const lernaPackages = await getPackages(lernaProject);
  const prettierConfig = lernaProject.manifest.get('prettier');
  // eslint-disable-next-line import/no-dynamic-require
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
      if (pkg.private) return;
      const ornikarConfig = pkg.get('ornikar');
      const emptyEntries = ornikarConfig && ornikarConfig.entries ? ornikarConfig.entries.length === 0 : false;

      const packagePath = path.relative(rootPath, pkg.location);

      const eslintPackageConfigPath = `${packagePath}/.eslintrc.json`;
      const eslintSrcConfigPath = useRollupToBuild ? `${packagePath}/src/.eslintrc.json` : eslintPackageConfigPath;

      await Promise.all([
        eslintPackageConfigPath !== eslintSrcConfigPath
          ? generateAndWritePackageRootConfig(eslintPackageConfigPath, prettierOptions)
          : undefined,
        emptyEntries
          ? fs.unlink(eslintSrcConfigPath).catch(() => {})
          : generateAndWritePackageSourceConfig(eslintSrcConfigPath, prettierOptions, {
              packagePath,
              useRollupToBuild,
            }),
      ]);
    }),
  ]);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
