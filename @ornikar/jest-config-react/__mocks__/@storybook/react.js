/* eslint-env jest */

'use strict';

const { render } = require('@testing-library/react');

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
      const parameters = { name: storyName, ...localParameters, ...storyParameters };
      const { jest } = parameters;
      const { ignore, ignoreDecorators } = jest || {};

      if (ignore) {
        test.skip(storyName, () => {});
        return api;
      }

      describe(groupName, () => {
        it(storyName, () => {
          const wrappingComponent = ignoreDecorators
            ? undefined
            : ({ children }) => decorateStory(() => children, [...globalDecorators, ...localDecorators])(parameters);

          const { unmount, asFragment } = render(story(parameters), { wrapper: wrappingComponent });
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
