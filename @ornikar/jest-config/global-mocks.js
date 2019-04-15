'use strict';

const timezoneMock = require('timezone-mock');

const { parse } = global.Date;
timezoneMock.register('UTC');

const MockDate = global.Date;
// 2018-07-30T08:52:42.679Z
const mockNowTime = 1532940762679;
MockDate.now = () => mockNowTime;
// Fix issue with parse not being overriden in timezone-mock.
// A pr is opened at timezone-mock to get rid of this hack https://github.com/Jimbly/timezone-mock/pull/21
MockDate.parse = parse;
MockDate.getFullYear = () => 2019;
