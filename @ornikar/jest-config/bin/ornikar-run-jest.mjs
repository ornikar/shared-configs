#!/usr/bin/env node

if (process.env.NODE_ENV == null) {
  process.env.NODE_ENV = 'test';
}
import('jest').then((module) => module.default.run());
