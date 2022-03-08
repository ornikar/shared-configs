'use strict';

const baseOrnikarPreset = require('@ornikar/jest-config/jest-preset');
const expoPreset = require('jest-expo/jest-preset');

module.exports = {
  ...baseOrnikarPreset,
  ...expoPreset,
  setupFiles: [...expoPreset.setupFiles, ...baseOrnikarPreset.setupFiles],
  testMatch: [
    ...baseOrnikarPreset.testMatch,
    '<rootDir>/src/**/stories.{ts,tsx}',
    '<rootDir>/src/**/*.stories.{ts,tsx}',
  ],
  moduleNameMapper: {
    ...expoPreset.moduleNameMapper,
    '^@storybook/addon-actions$': require.resolve('./__mocks__/@storybook/addon-actions.js'),
    '@storybook/react-native$': require.resolve('./__mocks__/@storybook/react-native.jsx'),
    '^@storybook/react-native$': require.resolve('./__mocks__/@storybook/react-native.jsx'),
    '@storybook/react$': require.resolve('./__mocks__/@storybook/react-native.jsx'),
    '^@storybook/react$': require.resolve('./__mocks__/@storybook/react-native.jsx'),
  },
  transform: {
    // remove svg asset transformer from expo config, as we configure svg with custom metro transformer
    ...Object.fromEntries(
      Object.entries(expoPreset.transform).map(([key, value]) => {
        if (key.includes('|svg|')) return [key.replace('|svg|', '|'), value];
        return [key, value];
      }),
    ),
    // legacy support, use { ReactComponent } from .svg instead.
    '\\.inline\\.svg$': '@ornikar/jest-config-react-native/svg-transformer-inline',
    '\\.svg$': '@ornikar/jest-config-react-native/svg-transformer',
  },
};
