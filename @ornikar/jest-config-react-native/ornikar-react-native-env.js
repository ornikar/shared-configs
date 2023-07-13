'use strict';

// eslint-disable-next-line import/no-unresolved
const ReactNativeEnv = require('react-native/jest/react-native-env');

module.exports = class OrnikarReactNativeEnv extends ReactNativeEnv {
  // eslint-disable-next-line class-methods-use-this
  exportConditions() {
    return ['react-native', 'jest'];
  }
};
