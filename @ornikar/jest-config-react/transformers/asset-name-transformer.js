'use strict';

const path = require('node:path');

module.exports = {
  process(src, filePath) {
    const assetFilename = JSON.stringify(path.basename(filePath));
    return { code: `module.exports = ${assetFilename};` };
  },
};
