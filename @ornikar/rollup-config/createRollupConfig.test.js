'use strict';

const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const createRollupConfig = require('./createRollupConfig');

describe('fixtures', () => {
  const testsPath = path.resolve(__dirname, './__fixtures__');
  const tests = fs.readdirSync(testsPath);

  tests.forEach((dirname) => {
    if (dirname === '.eslintrc.json') return;
    describe(dirname, () => {
      const configs = createRollupConfig({
        rootDir: `${testsPath}/${dirname}`,
      });

      configs.forEach((config) => {
        test(path.relative(process.cwd(), config.output[0].file), async () => {
          const bundle = await rollup.rollup(config);
          const {
            output: [{ code: actual }],
          } = await bundle.generate({ format: 'esm' });

          expect(actual).toMatchSnapshot();
        });
      });
    });
  });
});
