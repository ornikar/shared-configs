'use strict';

const path = require('path');
const { process } = require('./svg-transformer-inline');

exports.process = (src, filePath) => {
  const assetFilename = JSON.stringify(path.basename(filePath));
  const content = process(src, filePath);
  return content.replace(
    /module.exports = (.*);/,
    `module.exports = new Proxy({}, {
    get: function getter(target, key) {
      if (key === '__esModule') {
        return true;
      }
      if (key === 'default') {
        return ${assetFilename};
      }
      if (key === 'ReactComponent') {
        return $1;
      }
      throw new Error('Invalid key for svg-transformer jest mock: ' + key);
    }
  });`,
  );
};
