/* eslint-env jest */

'use strict';

if (!global.afterAll) {
  throw new Error(
    'Missing afterAll global in mock @storybook/react-native. Please check your jest test-setup and make sure you use testSetupAfterEnv.',
  );
}

const decorateStory = (storyFn, decorators) =>
  // eslint-disable-next-line unicorn/no-array-reduce
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

exports.decorateStory = decorateStory;

const globalDecorators = [];
const globalParameters = {};

// Mocked version of `import { addDecorator } from '@storybook/react-native'`.
exports.addDecorator = (decorator) => {
  globalDecorators.push(decorator);
};

// Mocked version of `import { addParameters } from '@storybook/react-native'`.
exports.addParameters = (parameters) => {
  Object.assign(globalParameters, parameters);
};

// Mocked version of `import { action } from '@storybook/react-native'`.
exports.action = (actionName) => jest.fn();

// Mocked version of: `import { storiesOf } from '@storybook/react-native'`
exports.storiesOf = (groupName) => {
  // eslint-disable-next-line global-require -- importing here allows cleanup to be called and prevent useless require in all tests as decorators/parameters are added in test-setup, before all tests
  const { render, waitFor } = require('@testing-library/react-native');

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
          const WrappingComponent = ignoreDecorators
            ? undefined
            : ({ children }) => decorateStory(() => children, [...localDecorators, ...globalDecorators])(context);

          const rtlApi = render(story(context), { wrapper: WrappingComponent });
          if (waitForExpectation) await waitFor(() => waitForExpectation(rtlApi, expect, { parameters }));
          expect(rtlApi.toJSON()).toMatchSnapshot();
          rtlApi.unmount();
        });
      });

      return api;
    },

    addParameters(parameters) {
      Object.assign(localParameters, parameters);

      if (parameters?.jest?.beforeAll) {
        parameters.jest.beforeAll();
      }

      return api;
    },

    addDecorator(decorator) {
      localDecorators.push(decorator);
      return api;
    },
  };

  return api;
};
