'use strict';

// order is: mockdate, then timezone mock
// requiring timezone mock sets its internal _Date, so date must be mocked before.
// eslint-disable-next-line import/order
const mockdate = require('mockdate');

mockdate.set('2018-07-30T08:52:42.679Z');

const timezoneMock = require('timezone-mock');

timezoneMock.register('UTC');

// Mock getFullYear
Date.getFullYear = () => 2019;
