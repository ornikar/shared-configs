'use strict';

const path = require('path');

module.exports = {
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    return `${path.dirname(testPath)}/__native_snapshots__/${path.basename(testPath)}${snapshotExtension}`;
  },

  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    return snapshotFilePath.replace('/__native_snapshots__', '').slice(0, -snapshotExtension.length);
  },

  testPathForConsistencyCheck: 'src/shared/components/Button/Button.test.tsx',
};
