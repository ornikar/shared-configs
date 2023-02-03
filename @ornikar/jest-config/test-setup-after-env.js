/* eslint-env jest */

'use strict';

// https://github.com/facebook/react/blob/master/scripts/jest/setupTests.js

const failOnConsole = require('jest-fail-on-console');

// Deprecated lifecycle methods are forbidden in our eslint config. This means any related warning is due to a dependency and can be ignored in tests.
const deprecatedReactLifeCycleMethods = [
  'componentWillMount',
  'componentWillUnmount',
  'componentWillUpdate',
  'componentWillReceiveProps',
];

failOnConsole({
  silenceMessage: (message) => {
    // Do not ignore the act / await warning anymore once we are on React 18
    if (message.includes('You called act(async () => ...) without await')) return true;
    return deprecatedReactLifeCycleMethods.some((lifecycleMethod) =>
      message.includes(`${lifecycleMethod} has been renamed, and is not recommended for use.`),
    );
  },
});
