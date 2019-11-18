'use strict';

module.exports = {
  extends: ['./plugins/node'].map(require.resolve),
  env: {
    browser: false,
    node: true,
    es6: true,
  },
  rules: {
    // allow process.exit
    'no-process-exit': 'off',

    // Allow for-of, now supported by node 6
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      // => allow 'ForOfStatement',
      'LabeledStatement',
      'WithStatement',
    ],

    // Use for-of instead of for
    'unicorn/no-for-loop': 'error',
  },
};
