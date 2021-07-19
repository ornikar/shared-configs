'use strict';

module.exports = {
  extends: [require.resolve('./styled-components')],

  rules: {
    // properties allowed by react-native
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'padding-vertical',
          'padding-horizontal',
          'shadow-color',
          'shadow-offset',
          'shadow-radius',
          'shadow-opacity',
        ],
      },
    ],
  },
};
