'use strict';

const fs = require('fs').promises;
// eslint-disable-next-line import/no-extraneous-dependencies
const LernaProject = require('@lerna/project');

/**
 *
 * @param {String} cwd
 * @returns Promise<LernaProject>
 */
exports.createLernaProject = function createLernaProject(cwd = process.cwd()) {
  return new LernaProject(cwd);
};

/**
 * @param {LernaProject} lernaProject
 * @returns Promise<Package[]>
 */
exports.getPackages = function getPackages(lernaProject = exports.createLernaProject()) {
  return lernaProject.getPackages();
};

exports.readJsonFile = async function readJsonFile(jsonFilePath, defaultValue) {
  let content;
  try {
    content = await fs.readFile(jsonFilePath, 'utf-8');
  } catch {
    return defaultValue;
  }

  try {
    return JSON.parse(content);
  } catch (err) {
    throw new Error(`Invalid existing config "${jsonFilePath}": ${err.message}`);
  }
};
