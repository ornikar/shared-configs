'use strict';

const baseOrnikarPreset = require('@ornikar/jest-config-react/jest-preset');
const expoPreset = require('jest-expo/web/jest-preset');
const ornikarReactNativePreset = require('../jest-preset');

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
  transformIgnorePatterns: ornikarReactNativePreset.transformIgnorePatterns,
  transform: {
    // dont transform node_modules when already compiled
    'node_modules/.*/commonjs/.*\\.(js|jsx|ts|tsx)$': require.resolve('../transformers/identity-transformer.js'),

    // compilation of problematic node_modules has a simplier babel config
    'node_modules/(react-native-(calendars|reanimated)|native-base)/.*\\.(js|jsx|ts|tsx)$': require.resolve(
      '../transformers/babel-transformer-node-modules.js',
    ),

    // compilation of most node_modules with sucrase for faster setup
    'node_modules/(@?react-native.*|@?expo.*|@?react-navigation.*)/.*\\.(js|jsx|ts|tsx)$': '@sucrase/jest-plugin',

    // compilation of rest node_modules has a simplier babel config (might be additional transformIgnorePatterns)
    'node_modules.*\\.(js|jsx|ts|tsx)$': require.resolve('../transformers/babel-transformer-node-modules.js'),

    ...baseOrnikarPreset.transform,
  },
};
