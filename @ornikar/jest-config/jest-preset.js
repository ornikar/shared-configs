'use strict';

const fs = require('fs');
const path = require('fs');

const useTypescript = fs.existsSync(path.resolve('tsconfig.json'));

module.exports = {
  cacheDirectory: './node_modules/.cache/jest',
  testMatch: [
    `<rootDir>/src/**/__tests__/**/*.${useTypescript ? 'ts?(x)' : 'js'}`,
    `<rootDir>/src/**/*.test.${useTypescript ? 'ts?(x)' : 'js'}`,
  ],
  setupTestFrameworkScriptFile: require.resolve('./test-setup-framework.js'),
  setupFiles: [require.resolve('./test-shim.js'), '<rootDir>/test-setup.js'],
};
