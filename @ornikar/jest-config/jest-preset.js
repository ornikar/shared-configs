'use strict';

const fs = require('fs');
const path = require('path');

const useTypescript = fs.existsSync(path.resolve('tsconfig.json'));

module.exports = {
  cacheDirectory: './node_modules/.cache/jest',
  testMatch: [
    `<rootDir>/src/**/__tests__/**/*.${useTypescript ? '{js,ts,tsx}' : 'js'}`,
    `<rootDir>/src/**/*.test.${useTypescript ? '{js,ts,tsx}' : 'js'}`,
  ],
  setupFilesAfterEnv: [require.resolve('./test-setup-after-env.js')],
  setupFiles: [
    require.resolve('./test-shim.js'),
    require.resolve('./global-mocks.js'),
    // project setup should always be placed last.
    '<rootDir>/test-setup.js',
  ],
};
