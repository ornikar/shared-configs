'use strict';

module.exports = {
  rules: {
    // http://eslint.org/docs/rules/no-plusplus
    'no-plusplus': 'off',

    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md
    // `export default from './foo'` should work
    'import/no-named-as-default': 'off',

    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
    'import/prefer-default-export': 'off',
  },
};
