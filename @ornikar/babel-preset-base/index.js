'use strict';

module.exports = function preset(
  context,
  { enableTypescript = true, 'preset-env': envOptions = {}, babelRuntimeMinVersion } = {},
) {
  return {
    presets: [
      enableTypescript && '@babel/preset-typescript',

      [
        '@babel/preset-env',
        {
          // Include shipped proposals
          shippedProposals: true,
          // Include bugfixes
          bugfixes: true,
          // allow any other preset options
          ...envOptions,
        },
      ],
    ].filter(Boolean),
    plugins: [
      babelRuntimeMinVersion && [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          version: babelRuntimeMinVersion,
          corejs: false,
          helpers: true,
        },
      ],
    ].filter(Boolean),
  };
};
