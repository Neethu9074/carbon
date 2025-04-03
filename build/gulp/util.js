/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
/* eslint-disable no-var, strict, vars-on-top */

'use strict';

const fs = require('fs');
const os = require('os');
const opn = require('opn');
const path = require('path');
const clearModule = require('clear-module');
const execSync = require('child_process').execSync;

const paths = require('./paths');

exports.getVersion = function getVersion() {
  return require('../../package.json').version;
};

exports.getRevision = function getRevision() {
  return execSync('git rev-parse HEAD').toString().trim();
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
    tenantUnitId: 'fake_tenantUnitId',
    tenantUnitsCount: 2,
    tenantUnitDomainSuffix: 'pink.instana.rocks',
    butlerDomain: envConfig.butlerDomain,
    integrationBaseUrl: 'https://slack-rainbowtest-us-west-2.instana.rocks',
    analyticsTrackingId: 'UA-66215232-4',
    featureFlags: require(paths.featureFlags),
    configuration: { maxAllowedAlertingConfigurations: 200 },
    segmentKey: 'K8GUn26weHMSk0fXYVNyiKtDPHmzr9Fj',
    amplitudeKey: 'client-R2KC1Tw3m8BAnSOiVOSwMWosWdGyGDmN',
    agentEndpoint: 'ingress-pink-saas.instana.rocks',
    agentEndpointPort: 443,
    serverlessEndpoint: 'https://serverless-pink-saas.instana.rocks',
    mobileEndpoint: 'https://pink.instana.rocks/mobile/',
    websiteEndpoint: 'https://eum-pink-saas.instana.rocks',
    websiteScriptSource: 'https://eum.instana.io/eum.min.js'
  };
};

exports.getDevModeReleaseConfig = function getDevModeReleaseConfig(envConfig) {
  // ensure that feature flags file is reevaluated (required for dev mode watches)
  clearModule(paths.featureFlags);

  return {
    tenant: envConfig.tenant,
    tenantUnit: envConfig.tenantUnit,
    tenantUnitId: 'fake_tenantUnitId',
    tenantUnitsCount: 2,
    tenantUnitDomainSuffix: 'magenta.instana.rocks',
    butlerDomain: envConfig.butlerDomain,
    integrationBaseUrl: 'https://slack-eu-west-1.instana.io',
    analyticsTrackingId: 'UA-66215232-4',
    featureFlags: require(paths.featureFlags),
    configuration: { maxAllowedAlertingConfigurations: 200 },
    segmentKey: 'K8GUn26weHMSk0fXYVNyiKtDPHmzr9Fj',
    agentEndpoint: 'ingress-magenta-saas.instana.rocks',
    agentEndpointPort: 443,
    serverlessEndpoint: 'serverless-magenta-saas.instana.rocks',
    mobileEndpoint: 'https://magenta.instana.rocks/mobile/',
    websiteEndpoint: 'https://eum-magenta-saas.instana.rocks',
    websiteScriptSource: 'https://eum.instana.io/eum.min.js'
  };
};
