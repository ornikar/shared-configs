#!/usr/bin/env node

'use strict';

const fs = require('fs').promises;
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const prettierOptions = require('@ornikar/prettier-config');
// eslint-disable-next-line import/no-extraneous-dependencies
const prettier = require('prettier');
const { getGraphPackages } = require('..');

(async () => {
  const writeJsonFile = (jsonFilePath, content) => {
    return fs.writeFile(
      jsonFilePath,
      prettier.format(`${JSON.stringify(content, null, 2)}\n`, {
        filepath: 'tsconfig.json',
        ...prettierOptions,
      }),
    );
  };

  const { packages, packageLocations } = await getGraphPackages();

  const tsconfigFiles = [];
  const tsconfigBuildFiles = [];

  await Promise.all(
    packages.map(async (pkg, index) => {
      const packagePath = path.relative(path.resolve('.'), packageLocations[index]);
      const tsconfigPath = `${packagePath}/tsconfig.json`;
      const tsconfigBuildPath = `${packagePath}/tsconfig.build.json`;

      const ornikarConfig = pkg.get('ornikar');
      const emptyEntries = ornikarConfig && ornikarConfig.entries ? ornikarConfig.entries.length === 0 : false;

      if (emptyEntries) {
        await Promise.all([
          // tsconfig.json
          fs.unlink(tsconfigPath).catch(() => {}),
          // tsconfig.build.json
          fs.unlink(tsconfigBuildPath).catch(() => {}),
        ]);
        return;
      }

      // override is only available for private package, which is examples or apps
      const tsconfigCurrentContent = pkg.private ? JSON.parse(await fs.readFile(tsconfigPath)) : {};

      const filteredCurrentCompilerOptions = tsconfigCurrentContent.compilerOptions || {};
      const compilerOptions = {
        rootDir: 'src',
        baseUrl: './src',
        composite: true,
        incremental: true,
        isolatedModules: true,
        noEmit: false,
        noEmitOnError: true,
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
        outDir: `../../node_modules/.cache/tsc/${pkg.name}`,
        tsBuildInfoFile: `node_modules/.cache/tsc/${pkg.name}/tsbuildinfo`,
      };
      Object.keys(compilerOptions).forEach((key) => {
        delete filteredCurrentCompilerOptions[key];
      });

      const tsconfigContent = {
        extends: '../../tsconfig.base.json',
        ...tsconfigCurrentContent,
        compilerOptions: {
          ...compilerOptions,
          ...filteredCurrentCompilerOptions,
        },
        include: tsconfigCurrentContent.include || ['src', '../../typings'],
      };

      const tsconfigBuildContent = {
        extends: './tsconfig.json',
        compilerOptions: {
          outDir: 'dist/definitions',
          tsBuildInfoFile: 'dist/tsbuildinfo',
        },
        exclude: [
          'dist',
          '**/__mocks__',
          '**/__tests__',
          '**/*.test.ts',
          '**/*.test.tsx',
          '**/*.stories.ts',
          '**/*.stories.tsx',
          '**/stories.ts',
          '**/stories.tsx',
          '**/stories/**',
          '**/stories-list.ts',
        ],
      };

      // react-scripts doesn't like paths
      if (!pkg.private) {
        tsconfigContent.compilerOptions.paths = {
          [pkg.name]: ['./index.ts'],
        };
        tsconfigBuildContent.compilerOptions.paths = {
          [pkg.name]: ['./index.ts'],
        };
      }

      const dependencies = packages.filter((lernaPkg) => {
        if (lernaPkg.name === pkg.name) return false;
        return (
          (pkg.dependencies && pkg.dependencies[lernaPkg.name]) ||
          (pkg.devDependencies && pkg.devDependencies[lernaPkg.name]) ||
          (pkg.peerDependencies && pkg.peerDependencies[lernaPkg.name])
        );
      });

      const hasReact =
        (pkg.peerDependencies && pkg.peerDependencies.react) ||
        (pkg.private && pkg.dependencies && pkg.dependencies.react);

      if (hasReact && !['react-native', 'react-jsx', 'preserve'].includes(tsconfigContent.compilerOptions.jsx)) {
        tsconfigContent.compilerOptions.jsx = 'react-jsx';
      }

      if (dependencies.length > 0) {
        dependencies.forEach((pkgDep) => {
          const depPath = `../../../${pkgDep.name}/src`;
          if (!tsconfigContent.compilerOptions.paths) {
            tsconfigContent.compilerOptions.paths = {};
          }
          tsconfigContent.compilerOptions.paths[pkgDep.name] = [depPath];
          tsconfigContent.compilerOptions.paths[`${pkgDep.name}/*`] = [`${depPath}/*`];
        });
        tsconfigContent.references = dependencies.map((pkgDep) => ({
          path: `../../${pkgDep.name}/tsconfig.json`,
        }));
        tsconfigBuildContent.references = dependencies.map((pkgDep) => ({
          path: `../../${pkgDep.name}/tsconfig.build.json`,
        }));
      }

      tsconfigFiles.push(tsconfigPath);
      if (!pkg.private) tsconfigBuildFiles.push(tsconfigBuildPath);

      await Promise.all([
        // tsconfig.json
        writeJsonFile(tsconfigPath, tsconfigContent),
        // tsconfig.build.json
        pkg.private
          ? fs.unlink(tsconfigBuildPath).catch(() => {})
          : writeJsonFile(tsconfigBuildPath, tsconfigBuildContent),
      ]);
    }),
  );

  const [tsConfigContent, tsconfigBuildContent] = [tsconfigFiles, tsconfigBuildFiles].map((files) => {
    const references = files.map((filePath) => ({ path: filePath }));
    references.sort((a, b) => a.path.localeCompare(b.path, 'en'));
    return {
      files: [],
      references,
    };
  });

  await Promise.all([
    writeJsonFile('tsconfig.json', tsConfigContent),
    tsconfigBuildFiles.length === 0
      ? fs.unlink('tsconfig.build.json').catch(() => {})
      : writeJsonFile('tsconfig.build.json', tsconfigBuildContent),
  ]);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
