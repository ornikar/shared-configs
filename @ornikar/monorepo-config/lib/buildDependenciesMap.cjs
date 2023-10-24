'use strict';

// inspired by https://github.com/christophehurpeau/pob/blob/d331ddaad56f5ed0e119c356842192964bf89641/packages/yarn-workspace-utils/src/index.ts#L54C1-L87C1

exports.buildDependenciesMaps = (workspaces) => {
  const dependenciesMap = new Map();

  for (const dependent of workspaces) {
    for (const dependencyKey of ['devDependencies', 'dependencies', 'peerDependencies']) {
      for (const potentialDependency of workspaces) {
        if (dependent[dependencyKey] && dependent.pkg[dependencyKey][potentialDependency.pkg.name]) {
          if (!dependenciesMap.has(dependent)) {
            dependenciesMap.set(dependent, []);
          }
          dependenciesMap.get(dependent).push([potentialDependency, dependencyKey]);
        }
      }
    }
  }

  return dependenciesMap;
};
