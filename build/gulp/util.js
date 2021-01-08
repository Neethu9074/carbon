/* eslint-env node */
/* eslint-disable no-var, strict, vars-on-top */

'use strict';

const fs = require('fs');
const os = require('os');
const opn = require('opn');
const util = require('util');
const path = require('path');
const clearModule = require('clear-module');
const execSync = require('child_process').execSync;

const paths = require('./paths');

exports.getBanner = function getBanner() {
  var year = new Date().getFullYear();

  return util.format(
    'instana ui-client v%s | (c) %s instana Inc. | commit %s',
    exports.getVersion(),
    year === 2014 ? 2014 : '2014 - ' + year,
    exports.getRevision()
  );
};

exports.getVersion = function getVersion() {
  return require('../../package.json').version;
};

exports.getRevision = function getRevision() {
  return execSync('git rev-parse HEAD')
    .toString()
    .trim();
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
  fs.writeFileSync(path.join(paths.assetDir, 'config.json'), JSON.stringify(exports.getDevModeConfig(envConfig)));
};

exports.getDevModeConfig = function getDevModeConfig(envConfig) {
  // ensure that feature flags file is reevaluated (required for dev mode watches)
  clearModule(paths.featureFlags);

  return {
    tenant: envConfig.tenant,
    tenantUnit: envConfig.tenantUnit,
    tenantUnitDomainSuffix: 'instana.io',
    region: envConfig.region,
    butlerDomain: envConfig.butlerDomain,
    analyticsTrackingId: 'UA-66215232-4',
    mixpanelToken: 'd77cf014d1859ac6ebf349b214579823',
    featureFlags: require(paths.featureFlags),
    configuration: {},

    agentEndpoint: 'ingress-red-saas.instana.io',
    agentEndpointPort: '443',
    serverlessEndpoint: 'serverless-red-saas.instana.io:443'
  };
};
