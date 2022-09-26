'use strict';

module.exports = (env, webpackConfig) => {
  webpackConfig.module.rules.push({
    test: /\.(ts|js|tsx|jsx)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: '@linaria/webpack-loader',
        options: {
          sourceMap: env !== 'production',
          extension: '.css',
          babelOptions: {
            configFile: true,
            babelrc: false,
            browserslistConfigFile: false,
          },
        },
      },
    ],
  });
};
