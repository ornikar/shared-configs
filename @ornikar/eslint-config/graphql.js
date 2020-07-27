'use strict';

module.exports = {
  parserOptions: {
    sourceType: 'script',
  },

  rules: {
    // https://eslint.org/docs/rules/no-underscore-dangle
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__typename'],
      },
    ],
  },
};
