/* eslint-env jest */

'use strict';

const { shallow } = require('enzyme');

// Mocked version of `import { action } from '@storybook/react'`.
exports.action = actionName => jest.fn();

// Mocked version of: `import { storiesOf } from '@storybook/react'`
exports.storiesOf = groupName => {
  // Mocked API to generate tests from & snapshot stories.
  const api = {
    add(storyName, story) {
      describe(groupName, () => {
        it(storyName, () => {
          expect(shallow(story())).toMatchSnapshot();
        });
      });

      return api;
    },

    // Any `storybook-addon-*` packages may require noop-ing them:
    addDecorator() {
      return api;
    },
  };

  return api;
};
