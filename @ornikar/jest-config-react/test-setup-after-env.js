/* eslint-env jest */

'use strict';

const failOnConsole = require('jest-fail-on-console');

failOnConsole({
  silenceMessage: (message) => {
    // setNativeProps is used by @react-spring, so we can't do anything about it
    if (message.includes('setNativeProps is deprecated. Please update props using React state instead.')) {
      return true;
    }

    // This was making App.test.tsx fail for an unknown reason because we don't use componentWillMount at all in our codebase
    if (
      message.includes(
        'componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for detail',
      )
    ) {
      return true;
    }

    return false;
  },
});
