'use strict';

const timezoneMock = require('timezone-mock');

timezoneMock.register('UTC');

const MockDate = global.Date;
// 2018-07-30T08:52:42.679Z
const mockNowTime = 1532940762679;
MockDate.now = () => mockNowTime;
MockDate.getFullYear = () => 2019;
