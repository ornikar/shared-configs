'use strict';

const mockdate = require('mockdate');

mockdate.set('2018-07-30T08:52:42.679Z');

// Mock getFullYear
Date.getFullYear = () => 2019;
