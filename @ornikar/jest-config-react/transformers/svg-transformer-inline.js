'use strict';

const path = require('path');

exports.process = function process(src, filePath) {
  const assetFilename = JSON.stringify(path.basename(filePath));
  return {
    code: `
    const { jsx } = require('react/jsx-runtime');
    function JestSvgComponent(props) {
    return jsx(
      'svg',
      Object.assign({}, props, {'data-file-name': ${assetFilename}})
    );
    }
    module.exports = JestSvgComponent;
              `,
  };
};
