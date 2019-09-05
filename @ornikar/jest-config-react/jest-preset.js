'use strict';

const baseJestPreset = require('@ornikar/jest-config/jest-preset');

module.exports = {
  ...baseJestPreset,
  testMatch: [...baseJestPreset.testMatch, baseJestPreset.testMatch[0].replace('**/__tests__/**/*.', '**/stories.')],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: [
    ...baseJestPreset.setupFiles.slice(0, -1),
    require.resolve('./test-setup'),
    baseJestPreset.setupFiles[baseJestPreset.setupFiles.length - 1],
  ],
  transform: {
    '\\.svg$': require.resolve('./fileTransform'),
  },
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '@storybook/react$': require.resolve('./__mocks__/@storybook/react'),
    '@storybook/addon-knobs': require.resolve('./__mocks__/@storybook/addon-knobs'),
    'storybook-react-router': require.resolve('./__mocks__/storybook-react-router'),
  },
};
