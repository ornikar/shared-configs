'use strict';

const path = require('path');

exports.createMainConfig = function createMainConfig({
  srcPath = 'src',
  postcssImplementation,
  enableControls = false,
  addons = [],
  ...ornikarAddonOptions
} = {}) {
  if (
    addons.some(
      (addon) => addon === '@storybook/addon-react-native-web' || addon[0] === '@storybook/addon-react-native-web',
    )
  ) {
    throw new Error(
      "We don't want to use @storybook/addon-react-native-web to make sure we have the same configuration between our web applications and storybook web. Use `enableReactNativeWeb: true` instead.",
    );
  }

  return {
    typescript: {
      check: false,
    },
    stories: [`../${srcPath}/**/@(stories.ts?(x)|*.stories.ts?(x))`],
    addons: [
      // When cra preset is already installed, we should not have postcss addon
      addons.includes('@storybook/preset-create-react-app')
        ? null
        : {
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
      { name: require.resolve('./preset'), options: ornikarAddonOptions },
    ].filter(Boolean),
  };
};
