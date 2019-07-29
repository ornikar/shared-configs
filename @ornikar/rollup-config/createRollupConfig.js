'use strict';

const path = require('path');
const fs = require('fs');
const postcss = require('rollup-plugin-postcss');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const ignoreImport = require('rollup-plugin-ignore-import');
const configExternalDependencies = require('rollup-config-external-dependencies');

// eslint-disable-next-line import/no-dynamic-require
const rootPkg = require(path.resolve('./package.json'));

const extensions = ['.js', '.jsx', '.tsx', '.ts'];
const browserOnlyExtensions = ['.css'];

const createBuildsForPackage = (packagesDir, packageName) => {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const pkg = require(path.resolve(`./${packagesDir}/${packageName}/package.json`));
  const external = configExternalDependencies({
    devDependencies: { ...rootPkg.devDependencies, ...pkg.devDependencies },
    dependencies: { ...rootPkg.dependencies, ...pkg.dependencies },
    peerDependencies: { ...rootPkg.peerDependencies, ...pkg.peerDependencies },
  });

  const createBuild = (target, version, formats, production) => {
    const devSuffix = production ? '' : '-dev';
    const exportCss = target === 'browser' && version === 'all' && production;

    const inputBase = `./${packagesDir}/${packageName}/src/index`;
    const inputExt = extensions.find((ext) => fs.existsSync(path.resolve(`${inputBase}${ext}`)));

    if (!inputExt) throw new Error(`Could not find index file for package ${packageName}`);

    const distPath = `${packagesDir}/${packageName}/dist`;

    return {
      input: `${inputBase}${inputExt}`,
      output: formats.map((format) => ({
        file: `${distPath}/index-${target}-${version}${devSuffix}.${format}.js`,
        format,
        sourcemap: true,
        exports: 'named',
      })),
      external: target === 'node' ? (filePath) => (filePath.endsWith('.css') ? false : external(filePath)) : external,

      plugins: [
        target !== 'browser' &&
          ignoreImport({
            extensions: browserOnlyExtensions,
          }),
        postcss({
          extract: exportCss ? `${distPath}/styles.css` : true,
          modules: true,
          config: exportCss
            ? {
                path: path.resolve('./config/rollup-postcss.config'),
              }
            : false,
          minimize: false,
        }),
        babel({
          babelrc: false,
          configFile: true,
          envName: 'rollup',
          externalHelpers: false,
          exclude: 'node_modules/**',
          extensions,
          presets: [
            [
              '@babel/env',
              {
                modules: false,
                targets: target === 'node' ? { node: version } : undefined,
              },
            ],
          ],
          plugins: [
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
        commonjs(),
        resolve({
          customResolveOptions: {
            moduleDirectory: ['src'], // don't resolve node_modules, but allow src (see baseUrl in tsconfig)
            extensions,
          },
        }),
      ].filter(Boolean),
    };
  };

  const createBuilds = (target, version, formats) => [
    createBuild(target, version, formats, true),
    createBuild(target, version, formats, false),
  ];

  return [...createBuilds('node', '10.13', ['cjs']), ...createBuilds('browser', 'all', ['es'])];
};

module.exports = (packagesDir = '@ornikar') => {
  const packages = process.env.ORNIKAR_ONLY
    ? [process.env.ORNIKAR_ONLY]
    : fs.readdirSync(path.resolve(`./${packagesDir}`)).filter((packageName) => packageName !== '.DS_Store');

  return [].concat(...packages.map((packageName) => createBuildsForPackage(packagesDir, packageName)));
};
