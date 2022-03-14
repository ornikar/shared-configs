/* eslint-disable filenames/match-exported */

'use strict';

module.exports = function createOrnikarStorybookTheme(overrides) {
  return {
    base: 'light',
    brandTitle: 'Ornikar',
    brandUrl: '/',

    colorPrimary: '#4C34E0',
    colorSecondary: '#4C34E0',

    // UI
    appBg: '#E5E5E5',
    appContentBg: '#fff',
    appBorderColor: '#E5E5E5',
    appBorderRadius: 4,

    // Typography
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',

    // Text colors
    textColor: '#2C293D',
    textMutedColor: '#737373',
    textInverseColor: 'rgba(255,255,255,0.9)',

    // Toolbar default and active colors
    barTextColor: '#737373',
    barSelectedColor: '#4C34E0',
    barBg: '#fff',

    // Form colors
    inputBg: '#E5E5E5',
    inputBorder: '#737373',
    inputTextColor: '#2C293D',
    inputBorderRadius: 2,

    ...overrides,
  };
};
