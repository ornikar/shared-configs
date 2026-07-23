'use strict';

const ReactNativeEnv = require('@react-native/jest-preset/jest/react-native-env');

module.exports = class OrnikarReactNativeEnv extends ReactNativeEnv {
  // eslint-disable-next-line class-methods-use-this
  exportConditions() {
    return ['react-native', 'jest'];
  }
};
