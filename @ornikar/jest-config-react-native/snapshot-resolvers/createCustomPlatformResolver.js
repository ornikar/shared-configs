'use strict';

const path = require('path');

module.exports = function createCustomPlatformResolver(extensionSuffix) {
  return {
    resolveSnapshotPath: (testPath, snapshotExtension) =>
      path.join(
        path.join(path.dirname(testPath), '__snapshots__'),
        path.basename(testPath) + snapshotExtension + extensionSuffix,
      ),

    resolveTestPath: (snapshotPath, snapshotExtension) =>
      path.normalize(
        path.join(path.dirname(snapshotPath), '..', path.basename(snapshotPath, snapshotExtension + extensionSuffix)),
      ),

    testPathForConsistencyCheck: path.posix.join('consistency_check', 'example.test.js'),
  };
};
