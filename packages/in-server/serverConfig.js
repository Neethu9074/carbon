const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');

const possibleConfigFileLocations = [
  '/etc/instana/ui-client/config.yaml',
  '/etc/instana/ui-client/config.json',
  path.join(__dirname, 'serverConfig.yaml'),
  path.join(__dirname, 'serverConfig.json')
];

const configFileContent = getConfigFileContent();
if (!configFileContent) {
  throw new Error(`Could not locate existing/readable config file at any of the checkable locations. ` +
    `Checked: ${possibleConfigFileLocations.join(', ')}`);
}
module.exports = yaml.safeLoad(configFileContent);

function getConfigFileContent() {
  for (let i = 0; i < possibleConfigFileLocations.length; i++) {
    const location = possibleConfigFileLocations[i];

    try {
      // checks existence and readability at once
      return fs.readFileSync(location, {encoding: 'utf8'});
    } catch (e) {
      continue;
    }
  }

  return null;
}
