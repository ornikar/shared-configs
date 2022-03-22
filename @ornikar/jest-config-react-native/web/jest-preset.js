'use strict';

const baseOrnikarPreset = require('@ornikar/jest-config-react/jest-preset');
const expoPreset = require('jest-expo/web/jest-preset');

module.exports = {
  ...baseOrnikarPreset,
  ...expoPreset,
  snapshotResolver: require.resolve('../snapshot-resolvers/resolver.web.js'),
  setupFiles: [...expoPreset.setupFiles, ...baseOrnikarPreset.setupFiles],
  testMatch: [
    ...baseOrnikarPreset.testMatch,
    baseOrnikarPreset.testMatch[0].replace('**/__tests__/**/*.', '**/stories.'),
    baseOrnikarPreset.testMatch[0].replace('**/__tests__/**/*.', '**/*.stories.'),
  ],
  moduleNameMapper: {
    ...baseOrnikarPreset.moduleNameMapper,
    ...expoPreset.moduleNameMapper,
  },
  transform: {
    // compilation of problematic node_modules has a simplier config
    'node_modules.*\\.(js|jsx|ts|tsx)$': require.resolve('../transformers/babel-transformer-node-modules.js'),

    ...baseOrnikarPreset.transform,
  },
};
