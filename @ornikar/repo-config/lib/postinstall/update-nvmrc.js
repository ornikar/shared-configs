'use strict';

const fs = require('node:fs');
const path = require('node:path');

module.exports = function updateNvmrc() {
  const nvmrcContent = fs.readFileSync(path.resolve(__dirname, '../.nvmrc'), 'utf8');

  fs.writeFileSync(path.resolve('.nvmrc'), `${nvmrcContent.trim()}\n`, {
    mode: '644',
  });
};
