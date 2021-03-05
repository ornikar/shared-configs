/* eslint-disable filenames/match-exported */

'use strict';

const emptyFile = 'export default {}';
const emptyFileName = '\0rollup_plugin_ignoreBrowserOnlyImports_empty_module_placeholder';

module.exports = function ignoreBrowserOnlyImports({ extensions, exclude }) {
  return {
    resolveId(importee) {
      return extensions.some((ext) => importee.endsWith(ext)) && !exclude.test(importee) ? emptyFileName : null;
    },
    load(id) {
      return id === emptyFileName ? emptyFile : null;
    },
  };
};
