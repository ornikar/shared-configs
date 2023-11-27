'use strict';

/*
 * If you change something here, also change in @ornikar/webpack-config reactNativeWeb.js
 */

exports.customTransforms = {
  // compilation of ornikar packages
  'node_modules/@ornikar/.*\\.(js|cjs|mjs)$': require.resolve('./transformers/babel-transformer-ornikar-packages.js'),

  // compilation of problematic node_modules has a simpler babel config
  'node_modules/(react-native-(calendars|reanimated)|@react-native-community/netinfo|@react-native/virtualized-lists)/.*\\.(js|jsx|ts|tsx)$':
    require.resolve('./transformers/babel-transformer-node-modules.js'),

  // dont transform node_modules when already compiled
  'node_modules/.*/(commonjs|dist/(cjs|vendor)|build/)/.*\\.js$': require.resolve(
    './transformers/identity-transformer.js',
  ),

  // compilation of react-native with sucrase fails since expo 48 update
  'node_modules/react-native/.*\\.(js|jsx|ts|tsx)$': require.resolve(
    './transformers/babel-transformer-node-modules.js',
  ),

  // https://github.com/expo/expo/blob/d5d454eb585bdd8fb1a07e2910ba99dca8fd8786/packages/@expo/metro-config/src/transformer/createMultiRuleTransformer.ts#L207
  'node_modules/(expo-processing|@expo/vector-icons)/.*\\.(js|jsx|ts|tsx)$': [
    '@sucrase/jest-plugin',
    { transforms: ['jsx', 'imports'] },
  ],
  'node_modules/(expo-assets-utils)/.*\\.(js|jsx|ts|tsx)$': [
    '@sucrase/jest-plugin',
    { transforms: ['flow', 'imports'] },
  ],
  'node_modules/(@?(use-)?expo.*)/.*\\.(js|jsx|ts|tsx)$': ['@sucrase/jest-plugin', { transforms: ['imports'] }],

  // compilation of rest node_modules with sucrase
  'node_modules.*\\.(js|jsx|ts|tsx)$': '@sucrase/jest-plugin',
};
