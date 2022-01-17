'use strict';

const jestPreset = require('@ornikar/jest-config/jest-preset');
const expoPreset = require('jest-expo/jest-preset');
const mergeWith = require('lodash.mergewith');

function customizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    // eslint-disable-next-line unicorn/prefer-spread
    return objValue.concat(srcValue);
  }
  return undefined;
}

const basePreset = mergeWith(expoPreset, jestPreset, customizer);

module.exports = mergeWith(
  basePreset,
  {
    testMatch: ['<rootDir>/src/**/stories.{ts,tsx}', '<rootDir>/src/**/*.stories.{ts,tsx}'],
    moduleNameMapper: {
      '^@storybook/addon-actions$': require.resolve('./__mocks__/@storybook/addon-actions.js'),
      '@storybook/react-native$': require.resolve('./__mocks__/@storybook/react-native.jsx'),
      '^@storybook/react-native$': require.resolve('./__mocks__/@storybook/react-native.jsx'),
    },
  },
  customizer,
);
