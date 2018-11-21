'use strict';

/* Always load Intl Polyfill */
const IntlPolyfill = require('intl');
require('intl/locale-data/jsonp/fr');

global.Intl = IntlPolyfill;
global.NumberFormat = IntlPolyfill.NumberFormat;
global.DateTimeFormat = IntlPolyfill.DateTimeFormat;

global.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};

global.cancelAnimationFrame = callback => {
  setTimeout(callback, 0);
};
