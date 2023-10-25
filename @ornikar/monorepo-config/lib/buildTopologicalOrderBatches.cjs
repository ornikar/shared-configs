'use strict';

// inspired by https://github.com/christophehurpeau/pob/blob/d331ddaad56f5ed0e119c356842192964bf89641/packages/yarn-workspace-utils/src/index.ts#L88C27-L88C27

exports.buildTopologicalOrderBatches = (workspaces, dependenciesMap, topLevelWorkspace = workspaces[0]) => {
  const batches = [];

  const added = new Set();
  const toAdd = new Set(workspaces);

  while (toAdd.size > 0) {
    const batch = new Set();
    for (const workspace of toAdd) {
      // make sure top level workspace is always in the last batch
      if (workspace === topLevelWorkspace && toAdd.size > 1) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const dependencies = dependenciesMap.get(workspace);
      if (!dependencies || dependencies.every((w) => added.has(w[0]))) {
        batch.add(workspace);
      }
    }

    for (const workspace of batch) {
      added.add(workspace);
      toAdd.delete(workspace);
    }

    if (batch.size === 0) {
      throw new Error('Circular dependency detected');
    }
    batches.push([...batch]);
  }

  return batches;
};
