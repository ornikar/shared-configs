'use strict';

const fsSync = require('node:fs');
const fs = require('node:fs').promises;
const path = require('node:path');

exports.getTopLevelWorkspace = function getTopLevelWorkspace() {
  return { location: '.', pkg: JSON.parse(fsSync.readFileSync('./package.json')) };
};

exports.getSyncPackageLocations = function getSyncPackageLocations(topLevelWorkspace = exports.getTopLevelWorkspace()) {
  const packageLocations = topLevelWorkspace.pkg.workspaces.flatMap((workspace) => {
    if (!workspace.endsWith('/*')) throw new Error(`Invalid workspace: "${workspace}" must end with "/*"`);
    const packagesDir = workspace.slice(0, -2);
    return fsSync
      .readdirSync(path.resolve(`./${packagesDir}`))
      .filter((name) => name !== '.DS_Store' && !name.startsWith('.eslintrc'))
      .map((pkgName) => `${packagesDir}/${pkgName}`);
  });

  packageLocations.sort((a, b) => a.localeCompare(b, 'en'));
  return packageLocations;
};

exports.getSyncWorkspaces = function getSyncWorkspaces(topLevelWorkspace = exports.getTopLevelWorkspace()) {
  return [
    topLevelWorkspace,
    ...exports.getSyncPackageLocations(topLevelWorkspace).map((location) => {
      const pkgPath = `${location}/package.json`;
      const pkg = JSON.parse(fsSync.readFileSync(pkgPath));

      return { ...pkg, location };
    }),
  ];
};

exports.getTopologicalOrderWorkspaces = function getTopologicalOrderWorkspaces(
  topLevelWorkspace = exports.getTopLevelWorkspace(),
) {
  const workspaces = exports.getSyncWorkspaces(topLevelWorkspace);
  const dependenciesMap = exports.buildDependenciesMaps(workspaces);
  const batches = exports.buildTopologicalOrderBatches(workspaces, dependenciesMap);

  const topologicalOrderWorkspaces = [];

  for (const batch of batches) {
    batch.sort((a, b) => a.pkg.name.localeCompare(b.pkg.name, 'en'));
    topologicalOrderWorkspaces.push(...batch);
  }

  return topologicalOrderWorkspaces;
};

exports.readJsonFile = async function readJsonFile(jsonFilePath, defaultValue) {
  let content;
  try {
    content = await fs.readFile(jsonFilePath, 'utf8');
  } catch {
    return defaultValue;
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Invalid existing config "${jsonFilePath}": ${error.message}`);
  }
};
