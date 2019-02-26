'use strict';

module.exports = {
  extends: [
    'eslint-config-airbnb-base',
    'eslint-config-airbnb-base/rules/strict',
    '@ornikar/eslint-config/plugins/filenames',
    '@ornikar/eslint-config/plugins/prettier',
    '@ornikar/eslint-config/plugins/unicorn',
    './plugins/prefer-class-properties',
    '@ornikar/eslint-config/rules/best-practices',
    '@ornikar/eslint-config/rules/code-quality',
    '@ornikar/eslint-config/rules/style',
    '@ornikar/eslint-config/rules/expert',
  ].map(require.resolve),

  plugins: ['babel'],
  parser: 'babel-eslint',

  rules: {
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-commonjs.md
    // disallow require when using babel
    'import/no-commonjs': 'error',

    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/import/no-extraneous-dependencies.md
    // override default airbnb exceptions
    'import/no-extraneous-dependencies': ['error', { devDependencies: false }],
  },
};
