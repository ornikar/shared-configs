'use strict';

module.exports = {
  extends: [require.resolve('@ornikar/eslint-config-react')],

  settings: {
    'import/resolver': {
      node: {
        extensions: ['.mjs', '.js', '.json', '.ts', '.tsx'],
      },
    },
  },

  rules: {
    'import/extensions': ['error', { extensions: ['ts', 'tsx', 'js'] }],
    'react/jsx-filename-extension': ['error', { extensions: ['tsx', 'js'] }],
  },
};
