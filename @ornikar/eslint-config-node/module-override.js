'use strict';

module.exports = {
  extends: ['plugin:node/recommended-module'],
  rules: {
    // already checked by import plugin
    'node/no-unpublished-require': 'off',
    'node/no-unpublished-import': 'off',
    'node/no-extraneous-require': 'off',
    'node/no-extraneous-import': 'off',
    'node/no-missing-require': 'off',
    'node/no-missing-import': 'off',
  },
};
