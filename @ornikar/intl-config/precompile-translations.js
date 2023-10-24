'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { compile } = require('@formatjs/cli-lib');
const globSync = require('glob').sync;

process.env.NODE_ENV = 'production';

module.exports = ({ paths, defaultExtractedDestinationDirectory, defaultCompiledDestinationDirectory }) => {
  paths.forEach(
    ({
      extractedDestinationDirectory = defaultExtractedDestinationDirectory,
      compiledDestinationDirectory = defaultCompiledDestinationDirectory,
    }) => {
      fs.mkdirSync(compiledDestinationDirectory, { recursive: true });
      globSync(`${extractedDestinationDirectory}/**/*.json`, {}).map(async (filePath) => {
        const result = await compile([filePath], {
          format: 'simple',
          ast: true,
        });
        const compiledFilePath = path.resolve(
          compiledDestinationDirectory,
          path.relative(extractedDestinationDirectory, filePath),
        );
        fs.mkdirSync(path.dirname(compiledFilePath), { recursive: true });
        fs.writeFileSync(compiledFilePath, result);
      });
    },
  );
};
