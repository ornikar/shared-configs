'use strict';

module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIDs: {
            force: true,
            minify: true,
          },
          inlineStyles: {
            onlyMatchedOnce: false,
          },
          removeViewBox: false,
          removeUnknownsAndDefaults: {
            keepDataAttrs: false,
          },
        },
      },
    },
    {
      name: 'prefixIds',
      params: {
        prefixClassNames: false,
      },
    },
  ],
};
