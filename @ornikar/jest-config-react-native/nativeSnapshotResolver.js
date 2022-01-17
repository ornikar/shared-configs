'use strict';

const path = require('path');

module.exports = {
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    const snapshotPath = `${path.dirname(testPath)}/__native_snapshots__/${path.basename(
      testPath,
    )}${snapshotExtension}`;
    return snapshotPath;
  },

  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    const testPath = snapshotFilePath.replace('/__native_snapshots__', '').slice(0, -snapshotExtension.length);
    return testPath;
  },

  testPathForConsistencyCheck: 'src/shared/components/Button/Button.test.tsx',
};
