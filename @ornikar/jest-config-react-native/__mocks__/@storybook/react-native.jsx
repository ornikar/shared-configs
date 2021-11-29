/* eslint-env jest */

'use strict';

const { render, waitFor } = require('@testing-library/react-native');
const React = require('react');

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

// Mocked version of `import { addDecorator } from '@storybook/react-native'`.
exports.addDecorator = (decorator) => {
  globalDecorators.push(decorator);
};

// Mocked version of `import { action } from '@storybook/react-native'`.
exports.action = (actionName) => jest.fn();

// Mocked version of: `import { storiesOf } from '@storybook/react-native'`
exports.storiesOf = (groupName) => {
  const localDecorators = [];
  const localParameters = {};

  // Mocked API to generate tests from & snapshot stories.
  const api = {
    add(storyName, story, storyParameters = {}) {
      const parameters = { ...localParameters, ...storyParameters };
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

          const component = render(React.createElement(WrappingComponent, { children: story(context) }));
          if (waitForExpectation) await waitFor(waitForExpectation);
          expect(component.toJSON()).toMatchSnapshot();
        });
      });

      return api;
    },

    addParameters(parameters) {
      Object.assign(localParameters, parameters);
      return api;
    },

    addDecorator(decorator) {
      localDecorators.push(decorator);
      return api;
    },
  };

  return api;
};
