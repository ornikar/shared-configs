'use strict';

module.exports = {
  rules: {
    'max-depth': ['warn', 6],
    'max-lines': [
      'warn',
      {
        max: 120,
        skipBlankLines: false,
        skipComments: false,
      },
    ],
  },
  overrides: [
    {
      files: ['stories.js'],
      rules: {
        'max-lines': 'off',
      },
    },
  ],
};
