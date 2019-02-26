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
        extensions: ['.js', '.json', '.ts'],
      },
    },
    'import/extensions': ['.js', '.ts'],
  },

  rules: {
    'import/extensions': ['error', { extensions: ['ts', 'js'] }],

    /* issues */

    /* some exported type doesnt work. tsc check that anyway */
    'import/named': 'off',

    /* changed rules */

    // default is error, changed to warn
    '@typescript-eslint/explicit-member-accessibility': 'warn',
  },
};
