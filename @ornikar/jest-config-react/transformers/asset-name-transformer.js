'use strict';

const path = require('path');

module.exports = {
  process(src, filePath) {
    const assetFilename = JSON.stringify(path.basename(filePath));
    return `module.exports = ${assetFilename};`;
  },
};
