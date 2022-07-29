'use strict';

const baseOrnikarPreset = require('@ornikar/jest-config-react/jest-preset');
const expoPreset = require('jest-expo/web/jest-preset');
const { customTransforms } = require('../customTransforms');
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
    '^react-native-svg$': 'react-native-svg-web',
  },
  transformIgnorePatterns: ornikarReactNativePreset.transformIgnorePatterns,
  transform: {
    ...customTransforms,
    ...baseOrnikarPreset.transform,
  },
};
