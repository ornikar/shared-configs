'use strict';

module.exports = function preset(context, options) {
  return {
    presets: [
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
          useBuiltIns: true,
          useSpread: true,
          ...options,
        },
      ],
    ],
  };
};
