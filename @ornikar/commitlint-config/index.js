'use strict';

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // disable scope case
    // We use camelCase in directory names, and scope should match these directories in some cases.
    'scope-case': [0],
  },
};
