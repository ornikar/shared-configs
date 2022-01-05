'use strict';

const fsSync = require('fs');
const fs = require('fs').promises;
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
let PackageGraph = require('@lerna/package-graph');
// eslint-disable-next-line import/no-extraneous-dependencies
let LernaProject = require('@lerna/project');

// lerna 4 support
if (LernaProject.Project) {
  LernaProject = LernaProject.Project;
}
if (PackageGraph.PackageGraph) {
  PackageGraph = PackageGraph.PackageGraph;
}

/**
 *
 * @param {String} cwd
 * @returns Promise<LernaProject>
 */
exports.createLernaProject = function createLernaProject(cwd = process.cwd()) {
  return new LernaProject(cwd);
};

/**
 * @param {LernaProject} lernaProject
 * @returns Promise<Package[]>
 */
exports.getPackages = async function getPackages(lernaProject = exports.createLernaProject()) {
  const packages = await lernaProject.getPackages();
  packages.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  return packages;
};

exports.getSyncPackages = function getSyncPackages(packagesDir = '@ornikar') {
  const packageNames = fsSync
    .readdirSync(path.resolve(`./${packagesDir}`))
    .filter((name) => name !== '.DS_Store' && !name.startsWith('.eslintrc'));

  packageNames.sort((a, b) => a.localeCompare(b, 'en'));

  return packageNames.map((pkgName) => {
    const location = `${packagesDir}/${pkgName}`;
    const pkgPath = `${location}/package.json`;
    const pkg = JSON.parse(fsSync.readFileSync(pkgPath, 'utf-8'));

    return { ...pkg, location };
  });
};

exports.getGraphPackages = async function getGraphPackages(lernaProject = exports.createLernaProject()) {
  const nodes = await exports.getPackages(lernaProject);
  const graph = new PackageGraph(nodes);

  const packages = [];
  const packageLocations = [];

  while (graph.size > 0) {
    // pick the current set of nodes _without_ localDependencies (aka it is a "source" node)
    const batch = [...graph.values()].filter((node) => node.localDependencies.size === 0);
    batch.sort((a, b) => a.name.localeCompare(b.name, 'en'));

    // batches are composed of Package instances, not PackageGraphNodes
    packages.push(...batch.map((node) => node.pkg));
    packageLocations.push(...batch.map((node) => node.location));

    // pruning the graph changes the node.localDependencies.size test
    graph.prune(...batch);
  }

  return { packages, packageLocations };
};

exports.readJsonFile = async function readJsonFile(jsonFilePath, defaultValue) {
  let content;
  try {
    content = await fs.readFile(jsonFilePath, 'utf-8');
  } catch {
    return defaultValue;
  }

  try {
    return JSON.parse(content);
  } catch (err) {
    throw new Error(`Invalid existing config "${jsonFilePath}": ${err.message}`);
  }
};
