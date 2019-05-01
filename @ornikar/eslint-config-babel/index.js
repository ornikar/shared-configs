'use strict';

module.exports = {
  extends: ['@ornikar/eslint-config-babel-use'].map(require.resolve),

  plugins: ['babel'],
  parser: 'babel-eslint',
};
