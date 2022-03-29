'use strict';

/* eslint-env jest */
/* eslint-disable global-require */

const fs = require('fs');
const { transform } = require('@babel/core');

const presetPath = require.resolve('.');

const tests = fs.readdirSync(`${__dirname}/__tests_fixtures__`).filter((name) => name.endsWith('.js'));

tests.forEach((filename) => {
  // eslint-disable-next-line import/no-dynamic-require
  const testContent = require(`${__dirname}/__tests_fixtures__/${filename}`);

  test(testContent.name || filename, () => {
    try {
      const output = transform(testContent.actual, {
        filename,
        babelrc: false,
        configFile: false,
        presets: [...(testContent.babelPresets || []), [presetPath, testContent.presetOptions || {}]],
        plugins: [...(testContent.babelPlugins || [])],
      });

      const expected = testContent.expected.trim();
      const actual = output.code.trim();
      expect(actual).toBe(expected);
    } catch (err) {
      // eslint-disable-next-line no-underscore-dangle
      if (err._babel && err instanceof SyntaxError) {
        console.log(`Unexpected error in test: ${test.name || filename}`);
        console.log(`${err.name}: ${err.message}\n${err.codeFrame}`);
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
      } else {
        throw err;
      }
    }
  });
});
