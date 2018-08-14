'use strict';

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'].map(require.resolve),

  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['value'],
      },
    ],

    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],

    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes'],
      },
    ],

    'max-nesting-depth': 3,
  },
};
