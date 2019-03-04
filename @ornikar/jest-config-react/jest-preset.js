'use strict';

const fs = require('fs');
const path = require('path');
const baseJestPreset = require('@ornikar/jest-config/jest-preset');

const useTypescript = fs.existsSync(path.resolve('tsconfig.json'));

module.exports = {
  ...baseJestPreset,
  testMatch: [
    ...baseJestPreset.testMatch,
    `<rootDir>/src/**/stories.${useTypescript ? 'tsx' : 'js'}`,
  ],
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
