'use strict';

const path = require('path');

exports.createMainConfig = function createMainConfig({
  srcPath = 'src',
  postcssImplementation,
  enableControls = false,
  addons = [],
} = {}) {
  const addonsList = [
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
  ];

  // When cra preset is already installed, we should not have postcss addon
  if (addonsList.includes('@storybook/preset-create-react-app')) {
    addonsList.splice(0, 1);
  }
  return {
    typescript: {
      check: false,
    },
    stories: [`../${srcPath}/**/@(stories.ts?(x)|stories.ts?(x))`],
    addons: addonsList,
  };
};
