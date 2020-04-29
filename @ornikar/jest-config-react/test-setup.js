/* eslint-env jest */

'use strict';

// Usefull to display snapshot of portals (drawer or modal for example) with react testing library
jest.mock('react-dom', () => {
  return {
    ...jest.requireActual('react-dom'),
    createPortal: (element) => {
      return element;
    },
  };
});
