'use strict';

module.exports = {
  cacheDirectory: './node_modules/.cache/jest',
  setupTestFrameworkScriptFile: require.resolve('./test-setup-framework.js'),
  setupFiles: [require.resolve('./test-shim.js'), '<rootDir>/test-setup.js'],
};
