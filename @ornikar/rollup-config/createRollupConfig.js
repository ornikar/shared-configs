'use strict';

/* eslint-disable complexity, import/no-dynamic-require */

const path = require('path');
const fs = require('fs');
const postcss = require('rollup-plugin-postcss');
const { default: babel } = require('@rollup/plugin-babel');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const configExternalDependencies = require('rollup-config-external-dependencies');
const ignoreImport = require('./rollup-plugin-ignore-browser-only-imports');

const rootPkg = require(path.resolve('./package.json'));
const postcssConfig = require(path.resolve('./config/rollup-postcss.config.js'));

const extensions = ['.tsx', '.ts', '.js', '.jsx'];
const browserOnlyExtensions = ['.css'];

const createBuildsForPackage = (packagesDir, packageName, additionalPlugins = []) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const pkg = require(path.resolve(`./${packagesDir}/${packageName}/package.json`));
  const external = configExternalDependencies({
    devDependencies: { ...rootPkg.devDependencies, ...pkg.devDependencies },
    dependencies: { ...rootPkg.dependencies, ...pkg.dependencies },
    peerDependencies: { ...rootPkg.peerDependencies, ...pkg.peerDependencies },
  });
  const resolvedPackagePath = path.resolve(`${packagesDir}/${packageName}`);
  const distPath = `${packagesDir}/${packageName}/dist`;
  const inputBase = `./${packagesDir}/${packageName}/src/index`;

  const createBuild = (target, version, formats, production) => {
    const devSuffix = production ? '' : '-dev';
    const exportCss = target === 'browser' && version === 'all' && production;
    const preferConst = !(target === 'browser' && version !== 'modern');

    const inputExt = extensions.find((ext) => fs.existsSync(path.resolve(`${inputBase}${ext}`)));

    if (!inputExt) throw new Error(`Could not find index file for package ${packageName}`);

    return {
      input: `${inputBase}${inputExt}`,
      output: formats.map((format) => ({
        file: `${distPath}/index-${target}-${version}${devSuffix}.${format}.js`,
        format,
        sourcemap: true,
        exports: 'named',
        preferConst,
        externalLiveBindings: false,
        freeze: false,
      })),
      external: target === 'node' ? (filePath) => (filePath.endsWith('.css') ? false : external(filePath)) : external,

      onwarn(warning, warn) {
        // throw on certain warnings
        if (
          warning.code === 'NON_EXISTENT_EXPORT' ||
          warning.code === 'UNUSED_EXTERNAL_IMPORT' ||
          warning.code === 'UNRESOLVED_IMPORT'
        ) {
          throw new Error(warning.message);
        }

        // Use default for everything else
        warn(warning);
      },

      plugins: [
        // ignore node_modules css imports for node target. imports in browser target will be resolved by webpack.
        target === 'node' &&
          ignoreImport({
            extensions: browserOnlyExtensions,
            exclude: /\.module\.css$/, // exclude needs to be defined because default is `node_modules/**`. We ignore files that will be processed by postcss plugin.
          }),
        postcss({
          include: /\.module\.css$/,
          extract: exportCss ? path.resolve(`${distPath}/styles.css`) : true,
          autoModules: false,
          modules: {
            generateScopedName: `${packageName}_[local]_[hash:base64:5]`,
          },
          config: false,
          plugins: exportCss ? postcssConfig.plugins : false,
          minimize: false,
        }),
        babel({
          extensions,
          babelrc: false,
          configFile: true,
          envName: 'rollup',
          skipPreflightCheck: true,
          babelHelpers: 'runtime',
          exclude: 'node_modules/**',
          presets: [
            require.resolve('@babel/preset-typescript'),
            [
              require.resolve('@babel/preset-env'),
              {
                modules: false,
                targets: target === 'node' ? { node: version } : undefined,
                bugfixes: true,
                shippedProposals: true,
              },
            ],
          ],
          plugins: [
            [
              require.resolve('@babel/plugin-transform-runtime'),
              {
                corejs: false,
                helpers: true,
              },
            ],
            [
              require.resolve('babel-plugin-minify-replace'),
              {
                replacements: [
                  {
                    identifierName: '__TARGET__',
                    replacement: {
                      type: 'stringLiteral',
                      value: target,
                    },
                  },
                  {
                    identifierName: '__DEV__',
                    replacement: {
                      type: 'booleanLiteral',
                      value: !production,
                    },
                  },
                ],
              },
            ],
            require.resolve('babel-plugin-minify-dead-code-elimination'),
            require.resolve('babel-plugin-discard-module-references'),
          ].filter(Boolean),
        }),
        resolve({
          extensions,
          modulesOnly: true,
          jail: `${resolvedPackagePath}/src`,
          rootDir: resolvedPackagePath,
          moduleDirectories: ['src'],
          customResolveOptions: {
            moduleDirectories: ['src'], // don't resolve node_modules, but allow src (see baseUrl in tsconfig)
          },
        }),
        ...additionalPlugins,
      ].filter(Boolean),
    };
  };

  const createBuilds = (target, version, formats) => [
    createBuild(target, version, formats, true),
    createBuild(target, version, formats, false),
  ];

  return [...createBuilds('node', '12.13', ['cjs']), ...createBuilds('browser', 'all', ['es'])];
};

module.exports = (packagesDir = '@ornikar') => {
  const packages = process.env.ORNIKAR_ONLY
    ? [process.env.ORNIKAR_ONLY]
    : fs
        .readdirSync(path.resolve(`./${packagesDir}`))
        .filter((name) => name !== '.DS_Store' && !name.startsWith('.eslintrc'));

  return [].concat(...packages.map((packageName) => createBuildsForPackage(packagesDir, packageName)));
};
