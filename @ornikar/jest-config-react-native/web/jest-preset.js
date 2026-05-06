'use strict';

const baseOrnikarPreset = require('@ornikar/jest-config-react/jest-preset');
const expoPreset = require('jest-expo/web/jest-preset');
const { customTransforms } = require('../customTransforms');
const ornikarReactNativePreset = require('../jest-preset');

module.exports = {
  ...baseOrnikarPreset,
  ...expoPreset,
  testEnvironment: baseOrnikarPreset.testEnvironment, // override testEnvironment in expo preset
  testEnvironmentOptions: baseOrnikarPreset.testEnvironmentOptions,
  snapshotResolver: require.resolve('../snapshot-resolvers/resolver.web.js'),
  setupFiles: [...expoPreset.setupFiles, ...baseOrnikarPreset.setupFiles, require.resolve('../test-setup')],
  testMatch: [
    ...baseOrnikarPreset.testMatch,
    baseOrnikarPreset.testMatch[0].replace('**/__tests__/**/*.', '**/stories.'),
    baseOrnikarPreset.testMatch[0].replace('**/__tests__/**/*.', '**/*.stories.'),
  ],
  moduleNameMapper: {
    ...baseOrnikarPreset.moduleNameMapper,
    ...expoPreset.moduleNameMapper,
    '^react-native-svg$': 'react-native-svg-web',
  },
  transformIgnorePatterns: ornikarReactNativePreset.transformIgnorePatterns,
  transform: {
    ...customTransforms,
    ...baseOrnikarPreset.transform,
    // Resolve binary asset imports to their filename so snapshots stay readable.
    '^.+\\.(bmp|gif|jpg|jpeg|png|psd|webp|xml|m4v|mov|mp4|mpeg|mpg|webm|aac|aiff|caf|m4a|mp3|wav|html|pdf|otf|ttf|zip|heic|avif|db)$':
      require.resolve('@ornikar/jest-config-react/transformers/asset-name-transformer'),
  },
};
