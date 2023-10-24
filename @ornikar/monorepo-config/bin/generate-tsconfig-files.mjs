#!/usr/bin/env node

import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
// eslint-disable-next-line import/no-extraneous-dependencies
import prettierOptions from '@ornikar/prettier-config';
// eslint-disable-next-line import/no-extraneous-dependencies
import prettier from 'prettier';
import { getTopLevelWorkspace, getTopologicalOrderWorkspaces } from '../index.mjs';

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

  const topLevelWorkspace = getTopLevelWorkspace();
  const workspaces = getTopologicalOrderWorkspaces(topLevelWorkspace);
  const childWorkspaces = workspaces.filter((workspace) => workspace !== topLevelWorkspace);

  const tsconfigFiles = [];
  const tsconfigBuildFiles = [];

  const tsWorkspaces = childWorkspaces.filter(({ pkg }) => {
    const ornikarConfig = pkg.ornikar;
    const hasEmptyEntries = ornikarConfig && ornikarConfig.entries ? ornikarConfig.entries.length === 0 : false;
    return !hasEmptyEntries;
  });

  await Promise.all(
    childWorkspaces.map(async (workspace) => {
      const { pkg, location: packagePath } = workspace;
      const tsconfigPath = `${packagePath}/tsconfig.json`;
      const tsconfigEslintPath = `${packagePath}/tsconfig.eslint.json`;
      const tsconfigBuildPath = `${packagePath}/tsconfig.build.json`;

      if (!tsWorkspaces.includes(workspace)) {
        await Promise.all([
          // tsconfig.json
          fs.unlink(tsconfigPath).catch(() => {}),
          // tsconfig.build.json
          fs.unlink(tsconfigBuildPath).catch(() => {}),
        ]);
        return;
      }

      // override is only available for private package, which is examples or apps
      const tsconfigCurrentContent = pkg.private
        ? JSON.parse(
            await fs.readFile(tsconfigPath).catch(() => {
              return '{}';
            }),
          )
        : {};

      const hasReferences = tsWorkspaces.some(({ pkg: tsPkg }) => {
        if (tsPkg.name === pkg.name) return false;
        return (
          (tsPkg.dependencies && tsPkg.dependencies[pkg.name]) ||
          (tsPkg.devDependencies && tsPkg.devDependencies[pkg.name]) ||
          (tsPkg.peerDependencies && tsPkg.peerDependencies[pkg.name])
        );
      });

      const filteredCurrentCompilerOptions = tsconfigCurrentContent.compilerOptions || {};
      const isLegacyRootDirDot = !existsSync(path.join(packagePath, 'src'));
      const isApp = !!pkg.private && !hasReferences;
      const isRootDirSrc = !(isLegacyRootDirDot || filteredCurrentCompilerOptions.rootDirs);
      const isBaseUrlSrc = isApp && !isLegacyRootDirDot;

      const compilerOptions = {
        rootDir: isRootDirSrc ? 'src' : '.',
        baseUrl: isApp ? (isLegacyRootDirDot ? '.' : './src') : undefined,
        composite: true,
        incremental: true,
        isolatedModules: true,
        moduleDetection: 'force',
        noEmit: false,
        noEmitOnError: true,
        declaration: true,
        declarationMap: true,
        outDir: `../../node_modules/.cache/tsc/${pkg.name}`,
        tsBuildInfoFile: `../../node_modules/.cache/tsc/${pkg.name}/tsbuildinfo`,
      };

      if (!hasReferences) {
        compilerOptions.noEmit = true;
        delete compilerOptions.emitDeclarationOnly;
        delete filteredCurrentCompilerOptions.emitDeclarationOnly;
      } else {
        compilerOptions.noEmit = false;
        compilerOptions.emitDeclarationOnly = true;
      }

      Object.keys(compilerOptions).forEach((key) => {
        delete filteredCurrentCompilerOptions[key];
      });

      if (!isApp) {
        delete compilerOptions.baseUrl;
      }

      const tsconfigContent = {
        extends: '../../tsconfig.base.json',
        ...tsconfigCurrentContent,
        compilerOptions: {
          ...compilerOptions,
          ...filteredCurrentCompilerOptions,
        },
        include: tsconfigCurrentContent.include || [isRootDirSrc ? 'src' : '.', '../../typings'],
      };

      if (isLegacyRootDirDot) {
        tsconfigContent.exclude = tsconfigCurrentContent.exclude || ['node_modules'];
      }

      const tsconfigEslintContent = {
        extends: './tsconfig.json',
        compilerOptions: {
          noEmit: true,
        },
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

      if (!hasReferences) {
        tsconfigBuildContent.compilerOptions.noEmit = false;
        tsconfigBuildContent.compilerOptions.emitDeclarationOnly = true;
      } else {
        delete tsconfigBuildContent.compilerOptions.noEmit;
        delete tsconfigBuildContent.compilerOptions.emitDeclarationOnly;
      }

      // react-scripts doesn't like paths
      if (!pkg.private) {
        tsconfigContent.compilerOptions.paths = {
          [pkg.name]: ['./src/index.ts'],
        };
        tsconfigBuildContent.compilerOptions.paths = {
          [pkg.name]: ['./src/index.ts'],
        };
      }

      const tsDependencies = tsWorkspaces.filter(({ pkg: tsPkg }) => {
        if (tsPkg.name === pkg.name) return false;
        return (
          (pkg.dependencies && pkg.dependencies[tsPkg.name]) ||
          (pkg.devDependencies && pkg.devDependencies[tsPkg.name]) ||
          (pkg.peerDependencies && pkg.peerDependencies[tsPkg.name])
        );
      });

      const hasReact =
        (pkg.peerDependencies && pkg.peerDependencies.react) ||
        (pkg.private && pkg.dependencies && pkg.dependencies.react);

      if (hasReact && !['react-native', 'react-jsx', 'preserve'].includes(tsconfigContent.compilerOptions.jsx)) {
        tsconfigContent.compilerOptions.jsx = 'react-jsx';
      }

      if (tsDependencies.length > 0) {
        tsDependencies.forEach(({ pkg: tsDependencyPkg, location: tsDependencyLocation }) => {
          const depPath = `../../${isBaseUrlSrc ? '../' : ''}${tsDependencyLocation}/src`;
          if (!tsconfigContent.compilerOptions.paths) {
            tsconfigContent.compilerOptions.paths = {};
          }
          tsconfigContent.compilerOptions.paths[tsDependencyPkg.name] = [depPath];
          tsconfigContent.compilerOptions.paths[`${tsDependencyPkg.name}/*`] = [`${depPath}/*`];
        });
        tsconfigContent.references = tsDependencies.map(({ location: tsDependencyLocation }) => {
          return {
            path: `../../${tsDependencyLocation}/tsconfig.json`,
          };
        });
        tsconfigBuildContent.references = tsDependencies.map(({ location: tsDependencyLocation }) => {
          return {
            path: `../../${tsDependencyLocation}/tsconfig.build.json`,
          };
        });
      }

      tsconfigFiles.push(tsconfigPath);
      if (!pkg.private) tsconfigBuildFiles.push(tsconfigBuildPath);

      await Promise.all([
        // tsconfig.json
        writeJsonFile(tsconfigPath, tsconfigContent),
        // tsconfig.eslint.json
        writeJsonFile(tsconfigEslintPath, tsconfigEslintContent),
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
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
