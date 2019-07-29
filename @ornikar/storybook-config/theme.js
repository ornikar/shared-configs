/* eslint-disable filenames/match-exported */

'use strict';

module.exports = function createOrnikarStorybookTheme(overrides) {
  return {
    base: 'light',
    brandTitle: 'Ornikar',
    brandUrl: '/',

    colorPrimary: '#FF8B33',
    colorSecondary: '#FF8B33',

    // UI
    appBg: '#DAE1E6',
    appContentBg: '#FAFBFC',
    appBorderColor: '#CFD8DC',
    appBorderRadius: 4,

    // Typography
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',

    // Text colors
    textColor: '#38444C',
    textInverseColor: 'rgba(255,255,255,0.9)',

    // Toolbar default and active colors
    barTextColor: '#7B8E98',
    barSelectedColor: '#FF8B33',
    barBg: '#fff',

    // Form colors
    inputBg: '#DAE1E6',
    inputBorder: '#91A4AE',
    inputTextColor: '#586A74',
    inputBorderRadius: 2,

    ...overrides,
  };
};
