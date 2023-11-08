'use strict';

const sharedRules = require('./rules/shared-rules');

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules'].map(require.resolve),

  plugins: ['stylelint-order'].map(require.resolve),

  rules: {
    ...sharedRules,
    'no-descending-specificity': null,
    'selector-class-pattern': null,
    'media-feature-range-notation': null,
    'declaration-block-no-redundant-longhand-properties': null,

    // override default rule to disable for composes, used in css modules
    // https://stylelint.io/user-guide/rules/value-keyword-case
    'value-keyword-case': ['lower', { ignoreProperties: ['composes'] }],
  },
};
