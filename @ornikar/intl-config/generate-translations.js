#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies, node/no-extraneous-require, no-param-reassign, node/no-missing-require */

'use strict';

const fs = require('fs');
const path = require('path');
const globSync = require('glob').sync;
const babelCore = require('@babel/core');

process.env.NODE_ENV = 'production';

module.exports = (paths) => {
  paths.forEach(({ name, messageGlob, distDir }) => {
    const defaultMessages = globSync(messageGlob, { ignore: '**/*.module.css.d.ts' })
      .map((filename) => ({ filename, code: fs.readFileSync(filename, 'utf8') }))
      .map(
        ({ filename, code }) =>
          babelCore.transformSync(code, {
            filename,
            presets: [require.resolve('babel-preset-react-app')],
            plugins: [require.resolve('babel-plugin-react-intl')],
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

    const destinationFile = path.join(distDir, `${name ? `fr-FR/${name}` : 'fr-FR'}.json`);
    const destinationFolder = path.dirname(destinationFile);

    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    fs.writeFileSync(destinationFile, JSON.stringify(defaultMessages, null, 2));
  });
};
