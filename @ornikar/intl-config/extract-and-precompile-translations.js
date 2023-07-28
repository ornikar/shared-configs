const extractTranslations = require('./extract-translations');
const precompileTranslations = require('./precompile-translations');

process.env.NODE_ENV = 'production';

module.exports = ({paths, defaultDestinationDirectory }) => {

  paths.forEach(({
    messageGlob,
    extractedTranslationsGlob,
    extractedDestinationDirectory,
    destinationDirectory = defaultDestinationDirectory
  }) => {

    extractTranslations({
      paths: [{messageGlob, destinationDirectory: extractedDestinationDirectory}]
    });

    precompileTranslations({
      paths: [{extractedTranslationsGlob, destinationDirectory}]
    });

  });

}
