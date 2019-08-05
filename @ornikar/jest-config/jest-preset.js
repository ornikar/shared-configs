'use strict';

const fs = require('fs');
const path = require('path');

const useLerna = fs.existsSync(path.resolve('lerna.json'));
const useTypescript = fs.existsSync(path.resolve('tsconfig.json'));
const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json')));

const src = (() => {
  if (!useLerna) return 'src';
  if (pkg.workspaces.length === 1) return `${pkg.workspaces[0]}/src`;
  return `{${pkg.workspaces.join(',')}}/src`;
})();

module.exports = {
  cacheDirectory: './node_modules/.cache/jest',
  testMatch: [
    // This first testMatch is used in jest-config-react
    `<rootDir>/${src}/**/__tests__/**/*.${useTypescript ? '{js,ts,tsx}' : 'js'}`,
    `<rootDir>/${src}/**/*.test.${useTypescript ? '{js,ts,tsx}' : 'js'}`,
  ],
  testPathIgnorePatterns: [],
  moduleDirectories: useLerna ? ['node_modules', 'src'] : ['node_modules'],
  modulePaths: useLerna ? [] : ['<rootDir>/src'],
  setupFilesAfterEnv: [require.resolve('./test-setup-after-env.js')],
  setupFiles: [
    require.resolve('./test-shim.js'),
    require.resolve('./global-mocks.js'),
    // project setup should always be placed last.
    '<rootDir>/test-setup.js',
  ],
};
