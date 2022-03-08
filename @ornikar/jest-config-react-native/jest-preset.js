'use strict';

const baseOrnikarPreset = require('@ornikar/jest-config-react/jest-preset');
const expoPreset = require('jest-expo/jest-preset');

module.exports = {
  ...baseOrnikarPreset,
  ...expoPreset,
  setupFiles: [...expoPreset.setupFiles, ...baseOrnikarPreset.setupFiles],
  testMatch: baseOrnikarPreset.testMatch,
  moduleNameMapper: {
    ...expoPreset.moduleNameMapper,
    '^@storybook/addon-actions$': require.resolve('./__mocks__/@storybook/addon-actions.js'),
    '@storybook/react-native$': require.resolve('./__mocks__/@storybook/react-native.jsx'),
    '^@storybook/react-native$': require.resolve('./__mocks__/@storybook/react-native.jsx'),
    '@storybook/react$': require.resolve('./__mocks__/@storybook/react-native.jsx'),
    '^@storybook/react$': require.resolve('./__mocks__/@storybook/react-native.jsx'),
  },
  transform: {
    // compilation of problematic node_modules has a simplier config
    'node_modules.*\\.(js|jsx|ts|tsx)$': require.resolve('./transformers/babel-transformer-node-modules.js'),

    // remove svg asset transformer from expo config, as we configure svg with custom metro transformer
    ...Object.fromEntries(
      Object.entries(expoPreset.transform).map(([key, value]) => {
        if (key.includes('|svg|')) return [key.replace('|svg|', '|'), value];
        return [key, value];
      }),
    ),
    // legacy support, use { ReactComponent } from .svg instead.
    '\\.inline\\.svg$': require.resolve('./transformers/svg-transformer-inline.js'),
    '\\.svg$': require.resolve('./transformers/svg-transformer.js'),
  },
};
