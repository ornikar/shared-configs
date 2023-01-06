'use strict';

const fs = require('fs');
const path = require('path');
const baseJestPreset = require('@ornikar/jest-config/jest-preset');

const useCraco = fs.existsSync(path.resolve('craco.config.js'));

module.exports = {
  ...baseJestPreset,

  // default maxWorkers is number of the cores - 1. This can means a lot of threads and memory usage, resulting in slower tests
  // 50% is a good compromise as it still adapt the number of threads based on the number of core available while reducing the memory usage
  // This is still configurable with cli `--max-workers` option.
  maxWorkers: '50%',

  testMatch: [
    ...baseJestPreset.testMatch,
    baseJestPreset.testMatch[0].replace('**/__tests__/**/*.', '**/stories.'),
    baseJestPreset.testMatch[0].replace('**/__tests__/**/*.', '**/*.stories.'),
  ],
  setupFiles: [
    ...baseJestPreset.setupFiles.slice(0, -1),
    require.resolve('./test-setup'),
    baseJestPreset.setupFiles.at(-1),
  ],
  transform: {
    '\\.raw\\.svg$': require.resolve('./transformers/asset-name-transformer'),
    // legacy support, use { ReactComponent } from .svg instead.
    '\\.inline\\.svg$': require.resolve('./transformers/svg-transformer-inline.js'),
    '\\.svg$': require.resolve('./transformers/svg-transformer.js'),
    ...(useCraco
      ? {}
      : {
          '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
        }),
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$', '^.+\\.css$'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '@storybook/react$': require.resolve('./__mocks__/@storybook/react'),
    '@storybook/react-native$': require.resolve('./__mocks__/@storybook/react'),
    '@storybook/addons': require.resolve('./__mocks__/@storybook/addons'),
    '@storybook/addon-actions': require.resolve('./__mocks__/@storybook/addon-actions'),
    '@storybook/addon-knobs': require.resolve('./__mocks__/@storybook/addon-knobs'),
    'storybook-react-router': require.resolve('./__mocks__/storybook-react-router'),
  },
};
