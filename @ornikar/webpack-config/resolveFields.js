'use strict';

module.exports = (env, webpackConfig) => {
  if (webpackConfig.resolve.mainFields) {
    throw new Error('mainFields already set');
  }

  const fields = env === 'production' ? ['browser', 'module', 'main'] : ['browser-dev', 'browser', 'module', 'main'];
  Object.assign(webpackConfig.resolve, {
    mainFields: fields,
    aliasFields: fields,
  });
};
