/* eslint-env jest */

'use strict';

const { shallow } = require('enzyme');

const decorateStory = (storyFn, decorators) =>
  decorators.reduce(
    (decorated, decorator) => (context = {}) =>
      decorator(
        (p = {}) =>
          decorated(
            // MUTATION !
            Object.assign(
              context,
              p,
              {
                parameters: Object.assign(
                  context.parameters || {},
                  p.parameters
                ),
              },
              { options: Object.assign(context.options || {}, p.options) }
            )
          ),
        context
      ),
    storyFn
  );

// Mocked version of `import { action } from '@storybook/react'`.
exports.action = actionName => jest.fn();

// Mocked version of: `import { storiesOf } from '@storybook/react'`
exports.storiesOf = groupName => {
  const localDecorators = [];
  // Mocked API to generate tests from & snapshot stories.
  const api = {
    add(storyName, story) {
      describe(groupName, () => {
        it(storyName, () => {
          expect(
            shallow(decorateStory(story, localDecorators)(), {
              disableLifecycleMethods: true,
            })
          ).toMatchSnapshot();
        });
      });

      return api;
    },

    // Any `storybook-addon-*` packages may require noop-ing them:
    addDecorator(decorator) {
      localDecorators.push(decorator);
      return api;
    },
  };

  return api;
};
