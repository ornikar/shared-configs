import fsSync from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { PackageGraph } from '@lerna/package-graph';
import { Project as LernaProject } from '@lerna/project';

/**
 *
 * @param {String} cwd
 * @returns Promise<LernaProject>
 */
export function createLernaProject(cwd = process.cwd()) {
  return new LernaProject(cwd);
}

/**
 * @param {LernaProject} lernaProject
 * @returns Promise<Package[]>
 */
export async function getPackages(lernaProject = createLernaProject()) {
  const packages = await lernaProject.getPackages();
  packages.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  return packages;
}

export function getSyncPackageLocations(workspaces = ['@ornikar/*']) {
  const packageLocations = workspaces.flatMap((workspace) => {
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

export function getSyncPackages(workspaces = ['@ornikar/*']) {
  return getSyncPackageLocations(workspaces).map((location) => {
    const pkgPath = `${location}/package.json`;
    const pkg = JSON.parse(fsSync.readFileSync(pkgPath));

    return { ...pkg, location };
  });
}

export async function getGraphPackages(lernaProject = createLernaProject()) {
  const nodes = await getPackages(lernaProject);
  const graph = new PackageGraph(nodes);

  const packages = [];
  const packageLocations = [];

  while (graph.size > 0) {
    // pick the current set of nodes _without_ localDependencies (aka it is a "source" node)
    const batch = [...graph.values()].filter((node) => node.localDependencies.size === 0);
    batch.sort((a, b) => a.pkg.name.localeCompare(b.pkg.name, 'en'));

    // batches are composed of Package instances, not PackageGraphNodes
    packages.push(...batch.map((node) => node.pkg));
    packageLocations.push(...batch.map((node) => node.location));

    // pruning the graph changes the node.localDependencies.size test
    graph.prune(...batch);
  }

  return { packages, packageLocations };
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
