'use strict';

exports.customTransforms = {
  // compilation of problematic node_modules has a simpler babel config
  'node_modules/(react-native-(calendars|reanimated)|native-base|@react-native-community/netinfo)/.*\\.(js|jsx|ts|tsx)$':
    require.resolve('./transformers/babel-transformer-node-modules.js'),

  // dont transform node_modules when already compiled
  'node_modules/.*/(commonjs|dist/cjs)/.*\\.js$': require.resolve('./transformers/identity-transformer.js'),

  // compilation of most node_modules with sucrase for faster setup
  'node_modules/(@?react-native.*|@?expo.*|@?react-navigation.*)/.*\\.(js|jsx|ts|tsx)$': '@sucrase/jest-plugin',

  // compilation of rest node_modules has a simpler babel config (might be additional transformIgnorePatterns)
  'node_modules.*\\.(js|jsx|ts|tsx)$': require.resolve('./transformers/babel-transformer-node-modules.js'),
};
