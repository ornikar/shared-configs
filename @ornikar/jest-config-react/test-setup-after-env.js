/* eslint-env jest */

'use strict';

const failOnConsole = require('jest-fail-on-console');

const deprecatedReactLifeCycleMethods = [
  'componentWillMount',
  'componentWillUnmount',
  'componentWillUpdate',
  'componentWillReceiveProps',
];

failOnConsole({
  silenceMessage: (message) => {
    // setNativeProps is used by @react-spring, so we can't do anything about it
    if (message.includes('setNativeProps is deprecated. Please update props using React state instead.')) {
      return true;
    }

    // Do not ignore the act / await warning anymore once we are on React 18
    if (message.includes('You called act(async () => ...) without await')) return true;

    // Warning from @react-aria/ssr
    if (message.startsWith('In React 18, SSRProvider is not necessary')) return true;

    // Deprecated lifecycle methods are forbidden in our eslint config. This means any related warning is due to a dependency and can be ignored in tests.
    if (
      deprecatedReactLifeCycleMethods.some((lifecycleMethod) =>
        message.includes(`${lifecycleMethod} has been renamed, and is not recommended for use.`),
      )
    ) {
      return true;
    }

    return false;
  },
});
