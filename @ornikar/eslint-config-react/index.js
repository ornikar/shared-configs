'use strict';

module.exports = {
  extends: [
    'eslint-config-airbnb/rules/react',
    'eslint-config-airbnb/rules/react-a11y',
    'eslint-config-prettier',
    'eslint-config-prettier/react',
    './rules/react',
  ].map(require.resolve),

  plugins: ['eslint-plugin-react-hooks'],

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
      },
    },
  },

  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
      },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['js'] }],

    'react-hooks/rules-of-hooks': 'error',
  },
};
