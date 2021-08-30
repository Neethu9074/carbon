/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');

const { logger } = require('./logging');

const possibleConfigFileLocations = [
  '/etc/instana/ui-client/config.yaml',
  '/etc/instana/ui-client/config.json',
  path.join(__dirname, '..', 'serverConfig.yaml'),
  path.join(__dirname, '..', 'serverConfig.json'),
  // To allow us to get rid of the term "serverConfig / clientConfig"
  path.join(__dirname, '..', 'config.yaml'),
  path.join(__dirname, '..', 'config.json')
];

const configFileContent = getConfigFileContent();
if (!configFileContent) {
  throw new Error(
    `Could not locate existing/readable config file at any of the checkable locations. ` +
      `Checked: ${possibleConfigFileLocations.join(', ')}`
  );
}
module.exports = yaml.load(configFileContent);

function getConfigFileContent() {
  for (let i = 0; i < possibleConfigFileLocations.length; i++) {
    const location = possibleConfigFileLocations[i];

    try {
      // checks existence and readability at once
      const configFile = fs.readFileSync(location, { encoding: 'utf8' });
      logger.info(`Will start with config file from: ${location}`);
      return configFile;
    } catch (e) {
      continue;
    }
  }

  return null;
}
