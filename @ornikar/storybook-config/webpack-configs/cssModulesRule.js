'use strict';

const path = require('node:path');

module.exports = (env, webpackConfig, srcDirectories, isCRAPresetEnabled) => {
  if (isCRAPresetEnabled) {
    const rules = webpackConfig.module.rules[2].oneOf;
    const cssModuleRule = rules.find(
      (rule) => !rule.exclude && rule.test && rule.test.toString() === /\.module\.css$/.toString(),
    );
    if (process.env.NODE_ENV !== 'production') {
      cssModuleRule.use = [
        ...cssModuleRule.use.slice(0, -1),
        '@ornikar/typed-css-modules-loader',
        ...cssModuleRule.use.slice(-1),
      ];
    }

    return;
  }

  const cssRule = webpackConfig.module.rules.find((rule) => rule.test && rule.test.toString() === /\.css$/.toString());
  cssRule.exclude = /\.module\.css$/;
  cssRule.sideEffects = true;

  webpackConfig.module.rules.push({
    test: /\.module\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: '[local]__[hash:base64:5]',
          },
          importLoaders: process.env.NODE_ENV !== 'production' ? 2 : 1,
        },
      },
      process.env.NODE_ENV !== 'production' && '@ornikar/typed-css-modules-loader',
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            config: path.resolve('./.storybook/postcss.config.js'),
          },
        },
      },
    ].filter(Boolean),
    include: srcDirectories.map((srcPath) => path.resolve(srcPath)),
  });
};
