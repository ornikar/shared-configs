'use strict';

module.exports = {
  extends: ['eslint-config-prettier'].map(require.resolve),

  rules: {
    // https://github.com/prettier/eslint-config-prettier#curly
    // prettier doesn't enforce {} with multiline
    curly: ['error', 'multi-line'],

    // https://github.com/prettier/eslint-config-prettier#quotes
    // prettier doesn't change backtick to single
    quotes: ['error', 'single', { avoidEscape: true }],
  },
};
