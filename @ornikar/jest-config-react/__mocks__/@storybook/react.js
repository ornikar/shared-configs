/* eslint-env jest */

'use strict';

const { act, render } = require('@testing-library/react');

const wait = (amount = 0) => new Promise((resolve) => setTimeout(resolve, amount));

const decorateStory = (storyFn, decorators) =>
  decorators.reduce(
    (decorated, decorator) =>
      (context = {}) =>
        decorator(
          (p = {}) =>
            decorated(
              // MUTATION !
              Object.assign(
                context,
                p,
                {
                  parameters: Object.assign(context.parameters || {}, p.parameters),
                },
                { options: Object.assign(context.options || {}, p.options) },
              ),
            ),
          context,
        ),
    storyFn,
  );

const globalDecorators = [];

// Mocked version of `import { addDecorator } from '@storybook/react'`.
exports.addDecorator = (decorator) => {
  globalDecorators.push(decorator);
};

// Mocked version of `import { action } from '@storybook/react'`.
exports.action = (actionName) => jest.fn();

// Mocked version of: `import { storiesOf } from '@storybook/react'`
exports.storiesOf = (groupName) => {
  const localDecorators = [];
  const localParameters = {};

  // Mocked API to generate tests from & snapshot stories.
  const api = {
    add(storyName, story, storyParameters = {}) {
      const parameters = { ...localParameters, ...storyParameters };
      const context = { name: storyName, parameters };
      const { jest } = parameters;
      const { ignore, ignoreDecorators } = jest || {};

      if (ignore) {
        test.skip(storyName, () => {});
        return api;
      }

      describe(groupName, () => {
        it(storyName, async () => {
          const wrappingComponent = ignoreDecorators
            ? undefined
            : ({ children }) => decorateStory(() => children, [...localDecorators, ...globalDecorators])(context);

          await act(async () => {
            const { unmount, asFragment } = render(story(context), { wrapper: wrappingComponent });
            // https://www.apollographql.com/docs/react/development-testing/testing/#testing-final-state
            // delays until the next "tick" of the event loop, and allows time
            // for that Promise returned from MockedProvider to be fulfilled
            await wait(0);
            expect(asFragment()).toMatchSnapshot();
            unmount();
          });
        });
      });

      return api;
    },

    addWithPercyOptions(storyName, percyOptions, story) {
      api.add(storyName, story);
    },

    addParameters(parameters) {
      Object.assign(localParameters, parameters);
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
