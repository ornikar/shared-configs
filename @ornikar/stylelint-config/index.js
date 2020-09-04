'use strict';

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules', 'stylelint-config-prettier'].map(
    require.resolve,
  ),

  plugins: ['stylelint-order'].map(require.resolve),

  rules: {
    'max-nesting-depth': 3,
    'no-descending-specificity': null,

    'order/order': ['declarations', 'rules', 'at-rules'],

    // override default rule to disable for composes, used in css modules
    // https://stylelint.io/user-guide/rules/value-keyword-case
    'value-keyword-case': ['lower', { ignoreProperties: ['composes'] }],

    // https://stylelint.io/user-guide/rules/comment-word-blacklist/
    'comment-word-blacklist': ['/^TODO:/', '/^FIXME:/'],

    // https://stylelint.io/user-guide/rules/property-blacklist/
    'property-blacklist': ['font-size'],

    // https://stylelint.io/user-guide/rules/declaration-property-value-whitelist/
    'declaration-property-value-whitelist': { 'font-family': ['inherit'] },
  },
};
