/* eslint-env node */
/* eslint-disable no-var, strict, vars-on-top */

'use strict';

var fs = require('fs');
var os = require('os');
var opn = require('opn');
var util = require('util');
var path = require('path');
var execSync = require('child_process').execSync;

var paths = require('./paths');

exports.getBanner = function getBanner() {
  var year = new Date().getFullYear();

  return util.format(
    'instana ui-client v%s | (c) %s instana Inc. | commit %s',
    exports.getVersion(),
    (year === 2014 ? 2014 : '2014 - ' + year),
    exports.getRevision()
  );
};


exports.getVersion = function getVersion() {
  return require('../../package.json').version;
};


exports.getRevision = function getRevision() {
  return execSync('git rev-parse HEAD').toString().trim();
};


exports.setActiveTheme = function setActiveTheme(themeName) {
  execSync('rm -f "' + paths.activeThemeLessFile + '"');
  execSync('rm -f "' + paths.activeThemeJsonFile + '"');

  const themeBaseName = path.join(paths.assetDir, themeName, 'config');
  execSync('ln -s "' + themeBaseName + '.json" "' + paths.activeThemeJsonFile + '"');
  execSync('ln -s "' + themeBaseName + '.less" "' + paths.activeThemeLessFile + '"');
};


exports.startProxrox = function startProxrox(config) {
  var configLocation = path.join(os.tmpdir(), '.proxrox.json');
  fs.writeFileSync(configLocation, JSON.stringify(config, 0, 2));

  var executable = path.join(paths.rootDir, 'node_modules', '.bin', 'proxrox');
  execSync('"' + executable + '" stop', {
    stdio: 'inherit'
  });
  execSync('"' + executable + '" start "' + configLocation + '"', {
    stdio: 'inherit'
  });
};


exports.openBrowser = opn;

exports.writeDevModeConfig = function writeDevModeConfig(envConfig) {
  var devConfig = {
    tenant: envConfig.tenant,
    tenantUnit: envConfig.tenantUnit,
    tenantUnitDomainSuffix: 'instana.io',
    environment: envConfig.environment,
    butlerDomain: envConfig.butlerDomain,
    analyticsTrackingId: 'UA-66215232-4',
    operationMode: 'saas'
  };
  fs.writeFileSync(
    path.join(paths.assetDir, 'config.json'),
    JSON.stringify(devConfig)
  );
};
