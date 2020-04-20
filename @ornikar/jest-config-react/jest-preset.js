'use strict';

const fs = require('fs');
const path = require('path');
const baseJestPreset = require('@ornikar/jest-config/jest-preset');

const useCraco = fs.existsSync(path.resolve('craco.config.js'));

module.exports = {
  ...baseJestPreset,
  testMatch: [...baseJestPreset.testMatch, baseJestPreset.testMatch[0].replace('**/__tests__/**/*.', '**/stories.')],
  setupFiles: [
    ...baseJestPreset.setupFiles.slice(0, -1),
    require.resolve('./test-setup'),
    baseJestPreset.setupFiles[baseJestPreset.setupFiles.length - 1],
  ],
  transform: useCraco
    ? {
        '\\.svg$': require.resolve('./fileTransform'),
      }
    : {
        '\\.svg$': require.resolve('./fileTransform'),
        '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
      },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$', '^.+\\.css$'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '@storybook/react$': require.resolve('./__mocks__/@storybook/react'),
    '@storybook/addon-knobs': require.resolve('./__mocks__/@storybook/addon-knobs'),
    'storybook-react-router': require.resolve('./__mocks__/storybook-react-router'),
  },
};
