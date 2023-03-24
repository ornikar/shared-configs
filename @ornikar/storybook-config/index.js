'use strict';

const path = require('path');

exports.createMainConfig = function createMainConfig({
  srcPath = 'src',
  postcssImplementation,
  enableControls = false,
  disableDocsAddon = false,
  enableDocsAddonInDev = false,
  disablePostcssAddon = false,
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

  if (disablePostcssAddon && postcssImplementation) {
    throw new Error('When disablePostcssAddon=true, you should not provide postcssImplementation');
  }

  return {
    core: {
      builder: 'webpack5',
    },
    typescript: {
      check: false,
    },
    stories: [`../${srcPath}/**/@(stories.ts?(x)|*.stories.ts?(x))`],
    addons: [
      disablePostcssAddon ||
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
          docs: disableDocsAddon ? false : enableDocsAddonInDev || process.env.NODE_ENV === 'production',
        },
      },
      ...addons,
      { name: require.resolve('./preset'), options: ornikarAddonOptions },
    ].filter(Boolean),
  };
};
