import fsSync from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { buildDependenciesMaps } from './lib/buildDependenciesMap.cjs';
import { buildTopologicalOrderBatches } from './lib/buildTopologicalOrderBatches.cjs';

export function getTopLevelWorkspace() {
  return { location: '.', pkg: JSON.parse(fsSync.readFileSync('./package.json')) };
}

export function getSyncPackageLocations(topLevelWorkspace = getTopLevelWorkspace()) {
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
}

export function getSyncWorkspaces(topLevelWorkspace = getTopLevelWorkspace()) {
  return [
    topLevelWorkspace,
    ...getSyncPackageLocations(topLevelWorkspace).map((location) => {
      const pkgPath = `${location}/package.json`;
      const pkg = JSON.parse(fsSync.readFileSync(pkgPath));
      return { pkg, location };
    }),
  ];
}

export function getTopologicalOrderWorkspaces(topLevelWorkspace = getTopLevelWorkspace()) {
  const workspaces = getSyncWorkspaces(topLevelWorkspace);
  const dependenciesMap = buildDependenciesMaps(workspaces);
  const batches = buildTopologicalOrderBatches(workspaces, dependenciesMap);

  const topologicalOrderWorkspaces = [];

  for (const batch of batches) {
    batch.sort((a, b) => a.pkg.name.localeCompare(b.pkg.name, 'en'));
    topologicalOrderWorkspaces.push(...batch);
  }

  return topologicalOrderWorkspaces;
}

export async function readJsonFile(jsonFilePath, defaultValue) {
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
}
