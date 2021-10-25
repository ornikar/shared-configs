'use strict';

const baseJestPreset = require('@ornikar/jest-config-react/jest-preset');
const reactNativePreset = require('react-native-web/jest-preset');

module.exports = {
  ...baseJestPreset,
  setupFiles: [...baseJestPreset.setupFiles, ...reactNativePreset.setupFiles],
  moduleNameMapper: {
    ...baseJestPreset.moduleNameMapper,
    ...reactNativePreset.moduleNameMapper,
  },
};
