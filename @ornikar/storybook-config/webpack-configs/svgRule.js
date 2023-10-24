'use strict';

const inlineSvg = require('@ornikar/webpack-config/inlineSvg');
const rawSvg = require('@ornikar/webpack-config/rawSvg');

module.exports = (env, webpackConfig) => {
  const imageRule = webpackConfig.module.rules.find(
    (rule) =>
      rule.test &&
      rule.test.toString() ===
        // eslint-disable-next-line security/detect-unsafe-regex
        /\.(svg|ico|jpg|jpeg|png|apng|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/.toString(),
  );
  imageRule.exclude = /\.(raw|inline)\.svg$/;

  inlineSvg(env, webpackConfig);
  rawSvg(env, webpackConfig);
};
