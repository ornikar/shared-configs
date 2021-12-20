/* eslint-disable no-param-reassign */

'use strict';

const fs = require('fs');
const path = require('path');
const babelCore = require('@babel/core');
const babelPluginReactIntl = require('babel-plugin-react-intl');
const globSync = require('glob').sync;
const sortObjectKeys = require('sort-object-keys');

process.env.NODE_ENV = 'production';

const sortFn = (a, b) => a.toLowerCase().localeCompare(b.toLowerCase());

module.exports = ({ paths, babelConfig, babelPluginReactIntlOptions = {}, defaultDestinationDirectory }) => {
  const babelPlugins = [[babelPluginReactIntl, babelPluginReactIntlOptions], ...(babelConfig.plugins || [])];
  const projectCollection = {};
  paths.forEach(({ name, messageGlob, destinationDirectory = defaultDestinationDirectory }) => {
    const defaultMessages = globSync(messageGlob, {
      ignore: ['**/*.module.css.d.ts', '**/stories.{ts,tsx,js,jsx}', '**/*.{test.ts,test.tsx,test.js,test.jsx}'],
    })
      .map((filename) => ({ filename, code: fs.readFileSync(filename, 'utf8') }))
      .map(
        ({ filename, code }) =>
          babelCore.transformSync(code, {
            filename,
            ...babelConfig,
            plugins: babelPlugins,
          }).metadata['react-intl'].messages,
      )
      // eslint-disable-next-line unicorn/prefer-object-from-entries
      .reduce((collection, descriptors) => {
        descriptors.forEach(({ id, defaultMessage }) => {
          if (Object.prototype.hasOwnProperty.call(projectCollection, id)) {
            throw new Error(`Duplicate message id: ${id}`);
          }
          collection[id] = defaultMessage;
          projectCollection[id] = defaultMessage;
        });
        return collection;
      }, {});

    const destinationFile = path.join(destinationDirectory, `${name ? `fr-FR/${name}` : 'fr-FR'}.json`);
    const destinationFolder = path.dirname(destinationFile);

    fs.mkdirSync(destinationFolder, { recursive: true });
    fs.writeFileSync(destinationFile, JSON.stringify(sortObjectKeys(defaultMessages, sortFn), null, 2));
  });
};
