'use strict';

module.exports = {
  extends: ['./react'].map(require.resolve),

  env: {
    browser: true,
  },

  globals: {
    __DEV__: true,
  },

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ios.js', '.android.js'],
      },
    },
  },

  rules: {
    'react/prefer-stateless-function': 'off',
    'react/no-unescaped-entities': 'off',
  },
};
