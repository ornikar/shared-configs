'use strict';

// [Expo 56]
// Expo installs the global `fetch` (expo/fetch) as a lazy getter: the module require only runs
// on first access. Under Jest that deferred require fires mid-test and is rejected ("import
// outside the scope of the test code"). Force it to resolve here, at setup, so it is cached
// before any test reads `fetch`.
Boolean(globalThis.fetch);
