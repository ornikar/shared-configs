#!/usr/bin/env node

// Importing @lerna-lite/cli has side effects: it parses process.argv and
// dispatches to the appropriate command. Only @lerna-lite/version is
// installed alongside it, so only `lerna version` (and the no-op `init`
// command bundled with the CLI) is reachable from this wrapper. Keeping
// this thin .mjs around lets `yarn lerna ...` resolve the same way it
// did under @lerna/cli, both via the script alias in the shared-configs
// root and via the `lerna` bin in consuming repos like kitt.

// eslint-disable-next-line import/no-unresolved -- ESM-only export with package.json#exports, not picked up by eslint-import-resolver-node
import '@lerna-lite/cli';
