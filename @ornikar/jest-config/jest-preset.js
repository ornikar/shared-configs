'use strict';

module.exports = {
  cacheDirectory: './node_modules/.cache/jest',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.js',
    '<rootDir>/src/**/*.test.js',
  ],
  setupTestFrameworkScriptFile: require.resolve('./test-setup-framework.js'),
  setupFiles: [require.resolve('./test-shim.js'), '<rootDir>/test-setup.js'],
};
