#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies, node/no-extraneous-require */

'use strict';

const path = require('path');
const fs = require('fs');
const LernaProject = require('@lerna/project');

(async () => {
  const lernaProject = new LernaProject(path.resolve('.'));
  const lernaPackages = await lernaProject.getPackages();

  lernaPackages.forEach((pkg) => {
    const packagePath = pkg.location;
    const tsconfigPath = `${packagePath}/tsconfig.json`;
    const tsconfigBuildPath = `${packagePath}/tsconfig.build.json`;

    const tsconfigContent = {
      extends: '../../tsconfig.base.json',
      compilerOptions: {
        rootDirs: ['src'],
        baseUrl: './src',
        paths: {
          [pkg.name]: ['./index.ts'],
        },
      },
      include: ['src', '../../typings'],
    };

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
        '**/stories.ts',
        '**/stories.tsx',
        '**/stories/**',
      ],
    };

    const dependencies = lernaPackages.filter((lernaPkg) => {
      if (lernaPkg.name === pkg.name) return false;
      return (
        (pkg.dependencies && pkg.dependencies[lernaPkg.name]) ||
        (pkg.devDependencies && pkg.devDependencies[lernaPkg.name]) ||
        (pkg.peerDependencies && pkg.peerDependencies[lernaPkg.name])
      );
    });

    const hasReact = pkg.peerDependencies && pkg.peerDependencies.react;
    if (hasReact) {
      tsconfigContent.compilerOptions.jsx = 'preserve';
    }

    if (dependencies.length !== 0) {
      dependencies.forEach((pkgDep) => {
        const depPath = `../../../${pkgDep.name}/src`;
        tsconfigContent.compilerOptions.paths[pkgDep.name] = [`${depPath}/index.ts`];
        tsconfigContent.compilerOptions.rootDirs.push(depPath);
      });
      tsconfigBuildContent.references = dependencies.map((pkgDep) => ({
        path: `../../${pkgDep.name}/tsconfig.build.json`,
      }));
      tsconfigBuildContent.compilerOptions.rootDirs = ['src'];
      tsconfigBuildContent.compilerOptions.paths = {};
    }

    fs.writeFileSync(tsconfigPath, `${JSON.stringify(tsconfigContent, undefined, 2)}\n`);
    fs.writeFileSync(tsconfigBuildPath, `${JSON.stringify(tsconfigBuildContent, undefined, 2)}\n`);
  });
})().catch(console.error);
