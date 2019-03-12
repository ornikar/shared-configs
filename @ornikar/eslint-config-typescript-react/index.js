'use strict';

module.exports = {
  extends: [require.resolve('@ornikar/eslint-config-react')],

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
      },
    },
  },

  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['tsx', 'js'] }],
  },
};
