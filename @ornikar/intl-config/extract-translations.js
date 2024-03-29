'use strict';

const fs = require('node:fs');
const path = require('node:path');
const babelCore = require('@babel/core');
const babelPluginFormatjs = require('babel-plugin-formatjs');
const globSync = require('glob').sync;

process.env.NODE_ENV = 'production';

const sortFn = ([a], [b]) => a.toLowerCase().localeCompare(b.toLowerCase());

module.exports = ({
  paths,
  babelPluginFormatjsOptions = {},
  defaultDestinationDirectory,
  defaultExtractedDestinationDirectory = defaultDestinationDirectory,
}) => {
  const projectCollection = {};
  const phraseSources = [];
  const phraseTargets = [];
  const seenPackages = [];

  paths.forEach(
    ({
      name,
      messageGlob,
      destinationDirectory = defaultExtractedDestinationDirectory,
      extractedDestinationDirectory = destinationDirectory,
    }) => {
      const defaultMessages = {};

      const babelConfig = babelCore.loadPartialConfig({
        envName: 'extract-translations',
        configFile: true,
        babelrc: false,
        browserslistConfigFile: false,
        plugins: [
          [
            babelPluginFormatjs,
            {
              preserveWhitespace: true,
              ...babelPluginFormatjsOptions,
              onMsgExtracted(filename, descriptors) {
                if (descriptors.length === 0) return;
                // eslint-disable-next-line security/detect-non-literal-regexp
                const filenameRegExp = new RegExp(
                  `${filename.split('.')[0]}\\.((web|ios|android)\\.)*${filename.split('.').at(-1)}`,
                );
                descriptors.forEach(({ id, defaultMessage }) => {
                  if (
                    id in projectCollection &&
                    (projectCollection[id].filename.match(filenameRegExp) === null ||
                      projectCollection[id].defaultMessage !== defaultMessage)
                  ) {
                    throw new Error(`Duplicate message id: ${id}`);
                  }
                  defaultMessages[id] = defaultMessage;
                  projectCollection[id] = { defaultMessage, filename };
                });
              },
            },
          ],
        ],
      });

      globSync(messageGlob, {
        ignore: ['**/*.module.css.d.ts', '**/stories.{ts,tsx,js,jsx}', '**/*.{test.ts,test.tsx,test.js,test.jsx}'],
      }).forEach((filename) => {
        babelCore.transformFileSync(filename, babelConfig.options);
      });

      const defaultMessagesEntries = Object.entries(defaultMessages);
      defaultMessagesEntries.sort(sortFn);
      const sortedDefaultMessages = Object.fromEntries(defaultMessagesEntries);

      if (!seenPackages.includes(extractedDestinationDirectory)) {
        phraseSources.push({
          file: path.join(extractedDestinationDirectory, 'source', '<locale_name>', '<tag>.json'),
          params: { update_translations: true },
        });
        seenPackages.push(extractedDestinationDirectory);
      }
      phraseTargets.push({
        file: path.join(extractedDestinationDirectory, '<locale_name>', '<tag>.json'),
        params: { tags: name },
      });

      const destinationFile = path.join(extractedDestinationDirectory, `${name ? `fr-FR/${name}` : 'fr-FR'}.json`);
      const destinationFolder = path.dirname(destinationFile);

      fs.mkdirSync(destinationFolder, { recursive: true });
      fs.writeFileSync(destinationFile, `${JSON.stringify(sortedDefaultMessages, null, 2)}\n`);
    },
  );
  return { phraseSources, phraseTargets };
};
