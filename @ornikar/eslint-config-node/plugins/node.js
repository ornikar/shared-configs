'use strict';

module.exports = {
  plugins: ['node'],
  extends: ['plugin:node/recommended'],
  rules: {
    // already checked by import plugin
    'node/no-unpublished-require': 'off',
    'node/no-extraneous-require': 'off',
    'node/no-missing-require': 'off',
  },
};
