#!/usr/bin/env node

import fs from 'node:fs/promises';
import { getPackages } from '../index.mjs';

const packages = await getPackages();

await Promise.all(
  packages.map((lernaPackage) => {
    if (!lernaPackage.peerDependencies) {
      return Promise.resolve();
    }

    const updatesToDo = packages.filter((lpkg) => lernaPackage.peerDependencies[lpkg.name]);

    if (updatesToDo.length === 0) {
      return Promise.resolve();
    }

    const pkg = lernaPackage.toJSON();

    updatesToDo.forEach((lpkg) => {
      pkg.peerDependencies[lpkg.name] = `${
        ['^', '~'].includes(lernaPackage.peerDependencies[lpkg.name].slice(0, 1))
          ? lernaPackage.peerDependencies[lpkg.name].slice(0, 1)
          : ''
      }${lpkg.version}`;
    });

    return fs.writeFile(lernaPackage.manifestLocation, `${JSON.stringify(pkg, null, 2)}\n`);
  }),
);
