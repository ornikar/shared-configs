'use strict';

const path = require('path');

module.exports = (env, webpackConfig) => {
  /* fix acorn rule in storybook docs - https://github.com/storybookjs/storybook/pull/17979 */
  const acornJsxRule = webpackConfig.module.rules.find(
    (rule) =>
      rule.test &&
      rule.test.toString() === /\.js$/.toString() &&
      rule.include &&
      rule.include.toString() === new RegExp(`node_modules\\${path.sep}acorn-jsx`).toString(),
  );
  if (!acornJsxRule) {
    console.warn('@ornikar/storybook-config: acorn-jsx rule seems to fixed, maybe remove fixAcornRule ?');
  } else {
    // eslint-disable-next-line no-param-reassign
    webpackConfig.module.rules = webpackConfig.module.rules.filter((rule) => rule !== acornJsxRule);
  }

  /* fix es6Transpiler.ts -- https://github.com/storybookjs/storybook/pull/18007 */

  const es6TranspilerRule = webpackConfig.module.rules.find(
    (rule) =>
      rule.test &&
      rule.test.toString() === /\.js$/.toString() &&
      rule.include &&
      rule.include.toString().startsWith('node_modules[\\/]@storybook').toString(),
  );

  if (!es6TranspilerRule) {
    console.warn('@ornikar/storybook-config: es6TranspilerRule is not found');
  } else {
    // eslint-disable-next-line no-param-reassign
    webpackConfig.module.rules = webpackConfig.module.rules.filter((rule) => rule !== es6TranspilerRule);
  }
};
