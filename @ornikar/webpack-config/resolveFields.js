'use strict';

module.exports = (env, webpackConfig) => {
  const fields = env === 'production' ? ['browser', 'module', 'main'] : ['browser-dev', 'browser', 'module', 'main'];
  Object.assign(webpackConfig.resolve, {
    mainFields: fields,
    aliasFields: fields,
  });
};
