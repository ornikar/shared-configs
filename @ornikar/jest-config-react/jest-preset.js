'use strict';

const baseJestPreset = require('@ornikar/jest-config/jest-preset');

module.exports = {
  ...baseJestPreset,
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFiles: [
    baseJestPreset.setupFiles[0],
    require.resolve('./test-setup'),
    baseJestPreset.setupFiles[1],
  ],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '@storybook/react$': require.resolve('./__mocks__/@storybook/react'),
  },
};
