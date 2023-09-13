'use strict';

const fs = require('fs');
const path = require('path');
const { compile } = require('@formatjs/cli-lib');
const globSync = require('glob').sync;

process.env.NODE_ENV = 'production';

module.exports = ({ paths }) => {
  paths.forEach(({ extractedTranslationsGlob, destinationDirectory }) => {
    globSync(extractedTranslationsGlob, {}).map(async (filePath) => {
      const result = await compile([filePath], {
        format: 'simple',
        ast: true,
      });
      fs.writeFileSync(path.resolve(destinationDirectory, path.basename(filePath)), result);
    });
  });
};
