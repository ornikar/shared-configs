'use strict';

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],

  extends: [
    'eslint-config-airbnb-base',
    'eslint-config-airbnb-base/rules/strict',
    'plugin:@typescript-eslint/recommended',
    '@ornikar/eslint-config/plugins/filenames',
    '@ornikar/eslint-config/plugins/prettier',
    'eslint-config-prettier/@typescript-eslint',
    '@ornikar/eslint-config/plugins/unicorn',
    './plugins/prefer-class-properties',
    '@ornikar/eslint-config/rules/best-practices',
    '@ornikar/eslint-config/rules/code-quality',
    '@ornikar/eslint-config/rules/style',
    '@ornikar/eslint-config/rules/expert',
  ].map(v => (v.startsWith('plugin:') ? v : require.resolve(v))),

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

    /* issues */

    /* some exported type doesnt work. tsc check that anyway */
    'import/named': 'off',

    /* disabled rules */

    // for example props can extends other props without setting new ones
    '@typescript-eslint/no-empty-interface': 'off',

    /* changed rules */

    // https://github.com/typescript-eslint/typescript-eslint/issues/201
    // private is comming in js world and no-public will be the most common way to read a js file (and probably ts)
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { accessibility: 'no-public' },
    ],
  },
};
