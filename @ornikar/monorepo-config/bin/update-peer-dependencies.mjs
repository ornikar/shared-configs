#!/usr/bin/env node
/* eslint-disable no-param-reassign */

import fs from 'node:fs/promises';
import { getSyncWorkspaces } from '../index.mjs';

const workspaces = await getSyncWorkspaces();

await Promise.all(
  workspaces.map(({ pkg, location }) => {
    if (!pkg.peerDependencies) {
      return Promise.resolve();
    }

    const updatesToDo = workspaces.filter(({ pkg: childPkg }) => pkg.peerDependencies[childPkg.name]);

    if (updatesToDo.length === 0) {
      return Promise.resolve();
    }

    updatesToDo.forEach(({ pkg: childPkg }) => {
      pkg.peerDependencies[childPkg.name] = `${
        ['^', '~'].includes(pkg.peerDependencies[childPkg.name].slice(0, 1))
          ? pkg.peerDependencies[childPkg.name].slice(0, 1)
          : ''
      }${childPkg.version}`;
    });

    return fs.writeFile(`${location}/package.json`, `${JSON.stringify(pkg, null, 2)}\n`);
  }),
);
