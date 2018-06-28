'use strict';

module.exports = {
  plugins: ['prettier'],
  extends: ['eslint-config-prettier'].map(require.resolve),

  rules: {
    'prettier/prettier': 'error',
  },
};
