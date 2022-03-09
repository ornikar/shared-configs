'use strict';

const path = require('path');

module.exports = function createCustomPlatformResolver(platform) {
  return {
    resolveSnapshotPath: (testPath, snapshotExtension) =>
      path.join(
        path.join(path.dirname(testPath), `__snapshots_${platform}__`),
        path.basename(testPath) + snapshotExtension,
      ),

    resolveTestPath: (snapshotPath, snapshotExtension) =>
      path.normalize(path.join(path.dirname(snapshotPath), '..', path.basename(snapshotPath, snapshotExtension))),

    testPathForConsistencyCheck: path.posix.join('consistency_check', 'example.test.js'),
  };
};
