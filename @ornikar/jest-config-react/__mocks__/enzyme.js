'use strict';

/**
 * Components using the react-intl module require access to the intl context.
 * See: https://github.com/formatjs/react-intl/blob/master/docs/Testing-with-React-Intl.md#enzyme
 */

const { IntlProvider } = require('react-intl');
const { mount, shallow } = require('enzyme');

const defaultLocale = 'fr';
const locale = defaultLocale;

exports.mount = (node) => {
  return mount(node, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
    },
  });
};

exports.shallow = (node) => {
  return shallow(node, {
    wrappingComponent: IntlProvider,
    wrappingComponentProps: {
      locale,
      defaultLocale,
    },
  });
};
