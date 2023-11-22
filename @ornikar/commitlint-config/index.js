'use strict';

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // disable scope case
    // We use camelCase in directory names, and scope should match these directories in some cases.
    'scope-case': [0],

    // not in the spec, see https://www.conventionalcommits.org/en/v1.0.0/#specification
    'header-max-length': [0],
    'footer-max-line-length': [0],
  },
};
