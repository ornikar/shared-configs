'use strict';

/* global jest */

// [Expo 56]
//  Winter runtime imports async-require/setup, which — because jsdom defines
// `window` and jest sets `__DEV__` — runs the dev-only Metro HMR client on import. setupHMR
// throws synchronously ("Missing required parameter `platform`": babel-preset-expo inlines
// process.env.EXPO_OS to the native branch at transform time, so it can't be flipped to 'web'
// at runtime); messageSocket opens a stray WebSocket. None of it is meaningful without a Metro
// dev server. Neutralize all three.
jest.mock('expo/src/async-require/setupHMR', () => ({}));
jest.mock('expo/src/async-require/setupFastRefresh', () => ({}));
