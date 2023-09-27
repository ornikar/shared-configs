/* eslint-disable global-require */

'use strict';

/*

Notes:

- since css-loader 1.0, minimize option is removed and cssnano must be added in css config.
- autoprefixer and cssnano uses browserlist, so projects should configure it using @ornikar/browserlist-config

 */

exports.syntaxPlugins = () => [require('postcss-nested')];

exports.themePlugin = (customPropertiesOptions) =>
  require('postcss-custom-properties')({
    // we will hopefully remove this plugin before we need to update it thanks to our universal transition
    disableDeprecationNotice: true,
    ...customPropertiesOptions,
  });

exports.customMediaPlugin = (customMediaOptions) => require('postcss-custom-media')(customMediaOptions);

exports.autoprefixerPlugin = () => require('autoprefixer');
