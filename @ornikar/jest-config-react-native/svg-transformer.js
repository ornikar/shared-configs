'use strict';

const { process } = require('jest-svg-transformer');

exports.process = (src, filepath) => {
  const content = process(src, filepath);
  return content.replace(
    /module.exports = (.*);/,
    `module.exports = new Proxy({}, {
    get: function getter(target, key) {
      if (key === '__esModule') {
        return false;
      }
      if (key === 'default') {
        return $1.name;
      }
      if (key === 'ReactComponent') {
        return $1;
      }
      throw new Error('Invalid key for svg-transformer jest mock: ' + key);
    }
  });`,
  );
};
