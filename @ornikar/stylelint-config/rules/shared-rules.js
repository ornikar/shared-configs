'use strict';

module.exports = {
  'max-nesting-depth': 3,

  'order/order': ['declarations', 'rules', 'at-rules'],

  // https://stylelint.io/user-guide/rules/comment-word-disallowed-list/
  'comment-word-disallowed-list': ['/^TODO:/', '/^FIXME:/'],

  // https://stylelint.io/user-guide/rules/declaration-property-value-allowed-list/
  // font-family, font-size, font-weight and font-style should be specified via Typography component.
  'declaration-property-value-allowed-list': {
    'font-family': ['inherit'],
    'font-size': ['inherit'],
    'font-weight': ['inherit'],
    'font-style': ['inherit'],
  },
};
