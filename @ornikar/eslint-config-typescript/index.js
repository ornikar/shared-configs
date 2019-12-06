'use strict';

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],

  extends: ['@ornikar/eslint-config-babel-use', './plugins/typescript-eslint'].map(require.resolve),

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts'],
      },
    },
    'import/extensions': ['.js', '.ts'],
  },

  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],

    // type-fest is typescript only
    'import/no-unresolved': [
      'error',
      {
        ignore: ['type-fest'],
      },
    ],

    /* issues */

    /* some exported type doesnt work. tsc check that anyway */
    'import/named': 'off',
  },
};
