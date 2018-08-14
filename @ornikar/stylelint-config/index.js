'use strict';

module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-prettier',
  ].map(require.resolve),

  rules: {
    'max-nesting-depth': 3,
  },
};
