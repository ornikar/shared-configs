'use strict';

const sharedRules = require('./rules/shared-rules');

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'].map(require.resolve),

  plugins: ['stylelint-order'].map(require.resolve),

  rules: {
    ...sharedRules,

    // the way template literal are used and prettier config, we do sometimes have a line before sometimes not.
    // Prettier ensures right format.
    'declaration-empty-line-before': null,

    // override default rule to disable for composes, used in css modules
    'value-keyword-case': null,

    // function can use camelCase because they can be js functions
    'function-name-case': null,
  },
};
