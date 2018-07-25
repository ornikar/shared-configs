'use strict';

module.exports = {
  extends: [
    'eslint-config-airbnb-base',
    './plugins/prettier',
    './plugins/unicorn',
    './rules/best-practices',
    './rules/code-quality',
    './rules/style',
    './rules/expert',
  ].map(require.resolve),

  parserOptions: {
    sourceType: 'script',
  },

  rules: {
    strict: 'error',
  },
};
