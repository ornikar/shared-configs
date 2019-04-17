'use strict';

/* global jasmine */

// https://github.com/facebook/react/blob/master/scripts/jest/setupTests.js

// eslint-disable-next-line import/no-extraneous-dependencies
const util = require('util');
const chalk = require('chalk');

const env = jasmine.getEnv();

['error', 'warn'].forEach(methodName => {
  const unexpectedConsoleCallStacks = [];
  const newMethod = function(format, ...args) {
    // Capture the call stack now so we can warn about it later.
    // The call stack has helpful information for the test author.
    // Don't throw yet though b'c it might be accidentally caught and suppressed.
    const errorStack = new Error().stack;
    unexpectedConsoleCallStacks.push([
      errorStack.substr(errorStack.indexOf('\n') + 1),
      util.format(format, ...args),
    ]);
  };

  console[methodName] = newMethod;

  env.beforeEach(() => {
    unexpectedConsoleCallStacks.length = 0;
  });

  env.afterEach(() => {
    if (console[methodName] !== newMethod) {
      throw new Error(
        `Test did not tear down console.${methodName} mock properly.`
      );
    }

    if (unexpectedConsoleCallStacks.length > 0) {
      const messages = unexpectedConsoleCallStacks.map(
        ([stack, message]) =>
          `${chalk.red(message)}\n` +
          `${stack
            .split('\n')
            .map(line => chalk.gray(line))
            .join('\n')}`
      );

      const message = `Expected test not to call ${chalk.bold(
        `console.${methodName}()`
      )}.\n\nIf the warning is expected, test for it explicitly.`;

      // throw messages;

      throw new Error(`${message}\n\n${messages.join('\n\n')}`);
    }
  });
});
