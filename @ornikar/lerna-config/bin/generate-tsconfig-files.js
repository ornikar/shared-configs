#!/usr/bin/env node

'use strict';

const fs = require('fs').promises;
const path = require('path');
const { getGraphPackages } = require('..');

(async () => {
  const { packages, packageLocations } = await getGraphPackages();

  const tsconfigFiles = [];
  const tsconfigBuildFiles = [];

  await Promise.all(
    packages.map(async (pkg, index) => {
      const packagePath = path.relative(path.resolve('.'), packageLocations[index]);
      const tsconfigPath = `${packagePath}/tsconfig.json`;
      const tsconfigBuildPath = `${packagePath}/tsconfig.build.json`;

      // override is only available for private package, which is examples or apps
      const tsconfigCurrentContent = pkg.private ? JSON.parse(await fs.readFile(tsconfigPath)) : {};

      const tsconfigContent = {
        ...tsconfigCurrentContent,
        extends: '../../tsconfig.base.json',
        compilerOptions: {
          rootDirs: ['src'],
          baseUrl: './src',
          ...tsconfigCurrentContent.compilerOptions,
        },
        include: tsconfigCurrentContent.include || ['src', '../../typings'],
      };

      if (!pkg.private) {
        // react-scripts doesn't like paths
        tsconfigContent.compilerOptions.paths = {
          [pkg.name]: ['./index.ts'],
        };
      }

      const tsconfigBuildContent = {
        extends: './tsconfig.json',
        compilerOptions: {
          rootDir: 'src',
          composite: true,
          noEmit: false,
          isolatedModules: false,
          emitDeclarationOnly: true,
          declarationMap: true,
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

      if (hasReact) {
        tsconfigContent.compilerOptions.jsx = 'react-jsx';
      }

      if (dependencies.length > 0) {
        if (!pkg.private) {
          dependencies.forEach((pkgDep) => {
            const depPath = `../../../${pkgDep.name}/src`;
            tsconfigContent.compilerOptions.paths[pkgDep.name] = [`${depPath}/index.ts`];
            tsconfigContent.compilerOptions.rootDirs.push(depPath);
          });
        }
        tsconfigBuildContent.references = dependencies.map((pkgDep) => ({
          path: `../../${pkgDep.name}/tsconfig.build.json`,
        }));
        tsconfigBuildContent.compilerOptions.rootDirs = ['src'];
        tsconfigBuildContent.compilerOptions.paths = {};
      }

      tsconfigFiles.push(tsconfigPath);
      if (!pkg.private) tsconfigBuildFiles.push(tsconfigBuildPath);

      await Promise.all([
        fs.writeFile(tsconfigPath, `${JSON.stringify(tsconfigContent, undefined, 2)}\n`),
        pkg.private
          ? fs.unlink(tsconfigBuildPath).catch(() => {})
          : fs.writeFile(tsconfigBuildPath, `${JSON.stringify(tsconfigBuildContent, undefined, 2)}\n`),
      ]);
    }),
  );

  const [tsConfigContent, tsconfigBuildContent] = [tsconfigFiles, tsconfigBuildFiles].map((files) => ({
    files: [],
    references: files.map((filePath) => ({ path: filePath })),
  }));

  await Promise.all([
    fs.writeFile('tsconfig.json', `${JSON.stringify(tsConfigContent, undefined, 2)}\n`),
    tsconfigBuildFiles.length === 0
      ? fs.unlink('tsconfig.build.json').catch(() => {})
      : fs.writeFile('tsconfig.build.json', `${JSON.stringify(tsconfigBuildContent, undefined, 2)}\n`),
  ]);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
