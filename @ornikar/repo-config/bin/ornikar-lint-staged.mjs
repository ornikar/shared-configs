#!/usr/bin/env node

// eslint-disable-next-line import/no-unresolved
import lintStaged from 'lint-staged';

lintStaged({
  concurrent: true,
  relative: true,
  maxArgLength: Number.MAX_SAFE_INTEGER, // prevents lint-staged from splitting into chunks as we have optimizations in config
})
  .then((passed) => {
    process.exitCode = passed ? 0 : 1;
  })
  .catch(() => {
    process.exitCode = 1;
  });
