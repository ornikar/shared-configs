'use strict';

const path = require('path');

exports.createMainConfig = function createMainConfig({
  srcPath = 'src',
  postcssImplementation,
  enableControls = false,
  addons = [],
} = {}) {
  return {
    typescript: {
      check: false,
    },
    stories: [`../${srcPath}/**/@(stories.ts?(x)|stories.ts?(x))`],
    addons: [
      {
        name: '@storybook/addon-postcss',
        options: {
          postcssLoaderOptions: {
            implementation: postcssImplementation,
            postcssOptions: {
              config: path.resolve('./.storybook/postcss.config.js'),
            },
          },
        },
      },

      {
        name: '@storybook/addon-essentials',
        options: {
          controls: enableControls,
        },
      },

      ...addons,
    ],
  };
};
