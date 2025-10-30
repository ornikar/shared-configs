'use strict';

/*
 * If you change something here, also change in @ornikar/webpack-config reactNativeWeb.js
 */

exports.customTransforms = {
  // compilation of ornikar packages
  'node_modules/@ornikar/(.[a-z-]*)/dist/.*\\.(js|cjs|mjs)$': require.resolve(
    './transformers/babel-transformer-ornikar-packages.js',
  ),

  // compilation of problematic node_modules has a simpler babel config
  'node_modules/(react-native-(calendars|reanimated)|@react-native-community/netinfo|@react-native/virtualized-lists)/.*\\.(js|jsx|ts|tsx)$':
    require.resolve('./transformers/babel-transformer-node-modules.js'),

  // dont transform node_modules when already compiled
  'node_modules/.*/(commonjs|dist/(cjs|vendor)|build/)/.*\\.js$': require.resolve(
    './transformers/identity-transformer.js',
  ),

  // The default Expo babel preset is not applied as we have our own babel config
  // See https://github.com/expo/expo/blob/sdk-52/packages/jest-expo/src/resolveBabelConfig.js
  'node_modules/(expo|expo-.*|@expo.*|react-native)/.*\\.(js|jsx|ts|tsx)$': require.resolve(
    './transformers/babel-transformer-node-modules.js',
  ),
};
