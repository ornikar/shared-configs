'use strict';

/*
 * If you change something here, also change in @ornikar/webpack-config reactNativeWeb.js
 */

exports.customTransforms = {
  // compilation of ornikar packages
  'node_modules/@ornikar/(.[a-z-]*)/dist/.*\\.(js|cjs|mjs)$': require.resolve(
    './transformers/babel-transformer-ornikar-packages.js',
  ),

  // dont transform node_modules when already compiled
  'node_modules/.*/(commonjs|dist/(cjs|vendor)|build/)/.*\\.js$': require.resolve(
    './transformers/identity-transformer.js',
  ),

  // compilation of rest node_modules with sucrase
  'node_modules.*\\.(js|jsx|ts|tsx)$': require.resolve('./transformers/babel-transformer-node-modules.js'),
};
