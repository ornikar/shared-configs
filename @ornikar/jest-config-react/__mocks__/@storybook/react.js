/* eslint-env jest */

'use strict';

const { render, waitFor } = require('@testing-library/react');

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
const globalParameters = {};

// Mocked version of `import { addDecorator } from '@storybook/react'`.
exports.addDecorator = (decorator) => {
  globalDecorators.push(decorator);
};

// Mocked version of `import { addParameters } from '@storybook/react'`.
exports.addParameters = (parameters) => {
  Object.assign(globalParameters, parameters);
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
      const parameters = { ...globalParameters, ...localParameters, ...storyParameters };
      const context = { name: storyName, parameters };
      const { jest } = parameters;
      const { ignore, ignoreDecorators, createBeforeAfterEachCallbacks, waitFor: waitForExpectation } = jest || {};

      if (ignore) {
        test.skip(storyName, () => {});
        return api;
      }

      describe(groupName, () => {
        if (createBeforeAfterEachCallbacks) {
          const { before, after } = createBeforeAfterEachCallbacks();
          if (before) beforeEach(before);
          if (after) afterEach(after);
        }

        it(storyName, async () => {
          const wrappingComponent = ignoreDecorators
            ? undefined
            : ({ children }) => decorateStory(() => children, [...localDecorators, ...globalDecorators])(context);

          const rtlApi = render(story(context), { wrapper: wrappingComponent });
          const { unmount, asFragment } = rtlApi;
          if (waitForExpectation) {
            await waitFor(() => waitForExpectation(rtlApi, expect, { parameters }));
          }
          expect(asFragment()).toMatchSnapshot();
          unmount();
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
