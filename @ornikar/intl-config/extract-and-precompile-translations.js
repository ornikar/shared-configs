'use strict';

const extractTranslations = require('./extract-translations');
const precompileTranslations = require('./precompile-translations');

process.env.NODE_ENV = 'production';

module.exports = ({ paths, defaultExtractedDestinationDirectory, defaultCompiledDestinationDirectory }) => {
  extractTranslations({
    paths,
    defaultDestinationDirectory: defaultExtractedDestinationDirectory,
  });
  precompileTranslations({
    paths,
    defaultExtractedDestinationDirectory,
    defaultCompiledDestinationDirectory,
  });
};
