/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const { getReportingEndpointsFromButler } = require('../reportingEndpoints.js');
const { getTenantInfoFromUiBackend } = require('../getTenantInfo.js');
const serverConfig = require('../../serverConfig.js');

exports.getFeatureFlags = () => Promise.resolve(serverConfig.clientConfig.featureFlags);
exports.getBaseUrl = () => Promise.resolve(serverConfig.baseUrl);
exports.getButlerDomain = () => Promise.resolve(serverConfig.clientConfig.butlerDomain);
exports.getConfiguration = () => Promise.resolve(serverConfig.clientConfig.configuration);
exports.getUiBackendBaseUrl = () => Promise.resolve(serverConfig.uiBackendBaseUrl);
exports.getGroundskeeperBaseUrl = () => Promise.resolve(serverConfig.groundskeeperBaseUrl);
exports.getButlerBaseUrl = () => Promise.resolve(serverConfig.butlerBaseUrl);
exports.getIntegrationBaseUrl = () => Promise.resolve(serverConfig.integrationBaseUrl);

exports.getReportingEndpoints = (req, tenant, unit) => {
  return getReportingEndpointsFromButler(req, serverConfig.butlerBaseUrl, tenant, unit);
};

exports.getTenantInfo = (req, tenant, unit) => {
  return getTenantInfoFromUiBackend(req, tenant, unit);
};
