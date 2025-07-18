'use strict';

/* eslint-disable import/no-dynamic-require */

const fs = require('node:fs');
const path = require('node:path');
const { default: babel } = require('@rollup/plugin-babel');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');
const configExternalDependencies = require('rollup-config-external-dependencies');
const postcss = require('rollup-plugin-postcss');
const svgr = require('rollup-plugin-svgr');
const ignoreImport = require('./rollup-plugin-ignore-browser-only-imports');

const rootPkg = require(path.resolve('./package.json'));
const postcssConfigPath = path.resolve('./config/rollup-postcss.config.js');
const postcssConfig = fs.existsSync(postcssConfigPath)
  ? require(path.resolve('./config/rollup-postcss.config.js'))
  : undefined;

const extensions = ['.tsx', '.ts', '.js', '.jsx'];
const browserOnlyExtensions = ['.css'];

const createBuildsForPackage = (
  packagesDir,
  packageName,
  { hasPlatformBuilds, shouldUseLinaria, additionalPlugins = [], rootDir = '.' } = {},
) => {
  // eslint-disable-next-line global-require
  const pkg = require(path.resolve(`${rootDir}/${packagesDir}/${packageName}/package.json`));
  if (pkg.private || !pkg.main) return [];

  const babelRuntimeMinVersion =
    pkg.dependencies && pkg.dependencies['@babel/runtime'] ? pkg.dependencies['@babel/runtime'].slice(1) : undefined;

  if (babelRuntimeMinVersion && /^(^|~)?7\.([0-9]\.|1[0-2]|13\.[0-7]$)/.test(babelRuntimeMinVersion)) {
    throw new Error(
      `Please require at least "@babel/runtime"@^7.13.8 in "dependencies" of "${packageName}". Current is "${babelRuntimeMinVersion}"`,
    );
  }

  const entries = (pkg.ornikar && pkg.ornikar.entries) || ['index'];

  const external = configExternalDependencies({
    devDependencies: { ...rootPkg.devDependencies, ...pkg.devDependencies },
    dependencies: { ...rootPkg.dependencies, ...pkg.dependencies },
    peerDependencies: { ...rootPkg.peerDependencies, ...pkg.peerDependencies },
  });
  const resolvedPackagePath = path.resolve(`${packagesDir}/${packageName}`);
  const distPath = `${rootDir}/${packagesDir}/${packageName}/dist`;
  const inputBaseDir = `${rootDir}/${packagesDir}/${packageName}/src/`;
  const useLinaria = shouldUseLinaria && shouldUseLinaria(packageName);
  // eslint-disable-next-line import/no-unresolved, global-require -- in peer dependencies, no gain to install it as devDependencies
  const linariaPlugin = useLinaria && require('@linaria/rollup').default;

  const createBuild = (entryName, target, version, formats, { exportCss, platformOS } = {}) => {
    const isForNativeOnly = platformOS && platformOS !== 'web';
    const preferConst = target === 'node' || isForNativeOnly;

    const inputExt = extensions.find((ext) => fs.existsSync(path.resolve(`${inputBaseDir}${entryName}${ext}`)));

    if (!inputExt) throw new Error(`Could not find ${entryName} file for package ${packageName}`);
    const isLinariaEnabledForPlatform = useLinaria && ((!platformOS && !hasPlatformBuilds) || platformOS === 'web');

    const getPresetEnvTargets = () => {
      if (target === 'node') {
        return { node: version };
      }
      if (platformOS && platformOS !== 'web') {
        return {
          // minimal transpilation as we target for metro which will reuse babel transforms anyway.
          // The transpilation is needed to allow rollup to understand the code.
          // We need to not transpile too much as reanimated plugin will happen on the app's side so the plugin have to understand the code.
          esmodules: true,
        };
      }
      // transpile for browsers supported by browserslist's config defined in package.json.
      return undefined;
    };

    const babelPresetBaseOptions = {
      babelRuntimeMinVersion,
      'preset-env': {
        modules: false,
        targets: getPresetEnvTargets(),
      },
    };

    const svgrBabelOptions = {
      presets: [
        ['@ornikar/babel-preset-base', { ...babelPresetBaseOptions, enableTypescript: false }],
        '@ornikar/babel-preset-react',
      ],
    };

    const getExtensionFromFormat = (format) => {
      if (target !== 'node') return 'js';
      if (pkg.type === 'module') {
        return format === 'es' ? 'js' : 'cjs';
      }
      return format === 'es' ? 'mjs' : 'js';
    };

    return {
      input: `${inputBaseDir}${entryName}${inputExt}`,
      output: formats.map((format) => ({
        file: [
          `${distPath}/`,
          entryName,
          target ? `-${target}` : '',
          version === 'all' ? '' : `-${version}`,
          `.${format}`,
          platformOS ? `.${platformOS}` : '',
          `.${getExtensionFromFormat(format)}`,
        ].join(''),
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
        isLinariaEnabledForPlatform &&
          linariaPlugin({
            sourceMap: true,
            classNameSlug: `${(pkg.ornikar && pkg.ornikar.linariaClassnamePrefix) || packageName}_[title]_[hash]`,
            babelOptions: {
              configFile: true,
              babelrc: false,
              browserslistConfigFile: false,
            },
          }),
        // ignore node_modules css imports for node target. imports in browser target will be resolved by webpack.
        target === 'node' &&
          ignoreImport({
            extensions: browserOnlyExtensions,
            exclude: /\.module\.css$/, // exclude needs to be defined because default is `node_modules/**`. We ignore files that will be processed by postcss plugin.
          }),
        postcss(
          useLinaria
            ? {
                extract: exportCss ? path.resolve(`${distPath}/styles.css`) : true,
                config: false,
              }
            : {
                include: /\.module\.css$/,
                extract: exportCss ? path.resolve(`${distPath}/styles.css`) : true,
                autoModules: false,
                modules: {
                  generateScopedName: `${packageName}_[local]_[hash:base64:5]`,
                },
                config: false,
                plugins: exportCss && postcssConfig ? postcssConfig.plugins : false,
                minimize: false,
              },
        ),
        // legacy inline support
        svgr({
          include: '**/*.inline.svg',
          jsxRuntime: 'automatic',
          native: !!platformOS && platformOS !== 'web',
          babel: svgrBabelOptions,
        }),
        svgr({
          exclude: '**/*.inline.svg',
          jsxRuntime: 'automatic',
          native: !!platformOS && platformOS !== 'web',
          exportType: 'named',
          babel: svgrBabelOptions,
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
            // Improve performance for native by reducing transformations: ` isForNativeOnly ? ['@babel/preset-typescript'] :`
            ['@ornikar/babel-preset-base', babelPresetBaseOptions],
            [
              require.resolve('@ornikar/babel-preset-kitt-universal'),
              {
                isWeb: platformOS === 'web',
                disableLinaria: !isLinariaEnabledForPlatform,
                enableStyledComponentsReactNativeImport: platformOS === 'web',
                styledComponentsOptions: {
                  namespace: packageName,
                  ssr: target === 'node' || platformOS === 'web',
                },
              },
            ],
            isLinariaEnabledForPlatform && '@linaria/babel-preset',
          ].filter(Boolean),
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
                ],
              },
            ],
            require.resolve('babel-plugin-minify-dead-code-elimination'),
            require.resolve('babel-plugin-discard-module-references'),
          ].filter(Boolean),
        }),
        // Add replace typeof window === undefined
        replace({
          preventAssignment: true,
          values: {
            __DEV__: '(process.env.NODE_ENV !== "production")',
          },
        }),
        resolve({
          extensions: platformOS ? extensions.flatMap((ext) => [`.${platformOS}${ext}`, ext]) : extensions,
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

  const hasPeerDependencyReactNative = !!(pkg.peerDependencies && pkg.peerDependencies['react-native']);
  const nodeVersion = '22.17';
  return entries.flatMap((entryName) =>
    [
      createBuild(entryName, '', 'all', ['es'], {
        hasPlatformBuilds: hasPeerDependencyReactNative,
        exportCss: !hasPeerDependencyReactNative,
      }),
      ...(hasPeerDependencyReactNative
        ? [
            createBuild(entryName, '', 'all', ['es'], { platformOS: 'web', exportCss: true }),
            createBuild(entryName, 'metro', 'all', ['es'], { platformOS: 'ios' }),
            createBuild(entryName, 'metro', 'all', ['es'], { platformOS: 'android' }),
          ]
        : []),
      createBuild(entryName, 'node', nodeVersion, ['es', 'cjs'], {
        hasPlatformBuilds: hasPeerDependencyReactNative,
      }),
      ...(hasPeerDependencyReactNative
        ? [createBuild(entryName, 'node', nodeVersion, ['es', 'cjs'], { platformOS: 'web' })]
        : []),
    ].filter(Boolean),
  );
};

module.exports = function createRollupConfig(options = {}) {
  if (typeof options === 'string') {
    // eslint-disable-next-line no-param-reassign
    options = {
      packagesDir: options,
    };
  }

  const { packagesDir = '@ornikar', ...createBuildsForPackageOptions } = options;

  const packages = process.env.ORNIKAR_ONLY
    ? [process.env.ORNIKAR_ONLY]
    : fs
        .readdirSync(path.resolve(`${createBuildsForPackageOptions.rootDir || '.'}/${packagesDir}`))
        .filter((name) => name !== '.DS_Store' && !name.startsWith('.eslintrc'));

  return packages.flatMap((packageName) =>
    createBuildsForPackage(packagesDir, packageName, createBuildsForPackageOptions),
  );
};
