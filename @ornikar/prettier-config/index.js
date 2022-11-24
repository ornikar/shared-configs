'use strict';

module.exports = {
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  arrowParens: 'always',
  overrides: [
    {
      files: ['.env', '.env.*', '*.env'],
      options: {
        parser: 'dot-properties',
        keySeparator: '=',
        singleQuote: false,
        printWidth: 0,
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        singleQuote: false,
      },
    },
  ],
};
