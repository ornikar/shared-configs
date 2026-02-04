'use strict';

const baseOrnikarPreset = require('@ornikar/jest-config-react/jest-preset');
const expoPreset = require('jest-expo/jest-preset');
const { customTransforms } = require('./customTransforms');

module.exports = {
  ...baseOrnikarPreset,
  ...expoPreset,
  setupFiles: [...expoPreset.setupFiles, ...baseOrnikarPreset.setupFiles, require.resolve('./test-setup')],
  testMatch: baseOrnikarPreset.testMatch,
  moduleNameMapper: {
    ...expoPreset.moduleNameMapper,
  },
  testEnvironment: require.resolve('./ornikar-react-native-env.js'),
  testEnvironmentOptions: expoPreset.testEnvironmentOptions || {},
  // override expo transformIgnorePatterns with custom config
  transformIgnorePatterns: [
    'node_modules/(?!(react-native.*|@react-native.*|expo.*|@expo(nent)?/.*|react-navigation.*|@react-navigation/.*|native-base|@ornikar/.*)/|mixpanel-react-native|axios|solito)',
  ],
  transform: {
    ...customTransforms,

    // remove svg asset transformer from expo config, as we configure svg with custom metro transformer
    ...Object.fromEntries(
      Object.entries(expoPreset.transform).map(([key, value]) => {
        if (key.includes('|svg|')) return [key.replace('|svg|', '|'), value];
        return [key, value];
      }),
    ),
    // legacy support, use { ReactComponent } from .svg instead.
    '\\.inline\\.svg$': require.resolve('@ornikar/jest-config-react/transformers/svg-transformer-inline.js'),
    '\\.svg$': require.resolve('@ornikar/jest-config-react/transformers/svg-transformer.js'),
  },
};
