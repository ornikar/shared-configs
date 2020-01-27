/* eslint-disable no-param-reassign */

'use strict';

const fs = require('fs');
const path = require('path');
const globSync = require('glob').sync;
const babelCore = require('@babel/core');
const babelPluginReactIntl = require('babel-plugin-react-intl');

process.env.NODE_ENV = 'production';

module.exports = ({ paths, babelConfig, defaultDestinationDirectory }) => {
  const babelPlugins = [babelPluginReactIntl, ...(babelConfig.plugins || [])];
  paths.forEach(({ name, messageGlob, destinationDirectory = defaultDestinationDirectory }) => {
    const defaultMessages = globSync(messageGlob, { ignore: ['**/*.module.css.d.ts', '**/stories.{ts,tsx}'] })
      .map((filename) => ({ filename, code: fs.readFileSync(filename, 'utf8') }))
      .map(
        ({ filename, code }) =>
          babelCore.transformSync(code, {
            filename,
            ...babelConfig,
            plugins: babelPlugins,
          }).metadata['react-intl'].messages,
      )
      .reduce((collection, descriptors) => {
        descriptors.forEach(({ id, defaultMessage }) => {
          if (Object.prototype.hasOwnProperty.call(collection, id)) {
            throw new Error(`Duplicate message id: ${id}`);
          }
          collection[id] = defaultMessage;
        });
        return collection;
      }, {});

    const destinationFile = path.join(destinationDirectory, `${name ? `fr-FR/${name}` : 'fr-FR'}.json`);
    const destinationFolder = path.dirname(destinationFile);

    fs.mkdirSync(destinationFolder, { recursive: true });
    fs.writeFileSync(destinationFile, JSON.stringify(defaultMessages, null, 2));
  });
};
