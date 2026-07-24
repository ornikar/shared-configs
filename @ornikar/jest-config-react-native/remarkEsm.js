'use strict';

const path = require('node:path');

// The unified/remark ESM ecosystem (used by @ornikar/markdown-universal) ships untranspiled ESM;
// these packages are spliced into the presets' transformIgnorePatterns so Babel transforms them like @ornikar/*.
const remarkEsmDeps =
  'unified|bail|trough|is-plain-obj|devlop|vfile|vfile-message|unist-util-[^/]+|mdast-util-[^/]+|mdast|micromark|micromark-[^/]+|remark-parse|remark-gfm|decode-named-character-reference[^/]*|character-entities[^/]*|ccount|escape-string-regexp|markdown-table|longest-streak|zwitch';

// vfile's node build breaks under Babel-transformed CJS (its `proc` import of `node:process`
// resolves to undefined, so `proc.cwd()` throws at parse time); map its `#min*` subpath imports
// to the self-contained browser builds instead.
let vfileModuleNameMapper = {};
try {
  const vfileLib = path.join(path.dirname(require.resolve('vfile')), 'lib');
  vfileModuleNameMapper = {
    '^#minpath$': path.join(vfileLib, 'minpath.browser.js'),
    '^#minproc$': path.join(vfileLib, 'minproc.browser.js'),
    '^#minurl$': path.join(vfileLib, 'minurl.browser.js'),
  };
} catch {
  // vfile is not installed (consumer does not use @ornikar/markdown-universal), no mapping needed
}

module.exports = { remarkEsmDeps, vfileModuleNameMapper };
