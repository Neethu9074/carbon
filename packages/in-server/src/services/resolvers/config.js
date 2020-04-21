const { getReportingEndpointsFromButler } = require('../reportingEndpoints.js');
const serverConfig = require('../../serverConfig.js');

exports.getFeatureFlags = () => Promise.resolve(serverConfig.clientConfig.featureFlags);
exports.getBaseUrl = () => Promise.resolve(serverConfig.baseUrl);
exports.getButlerDomain = () => Promise.resolve(serverConfig.clientConfig.butlerDomain);
exports.getConfiguration = () => Promise.resolve(serverConfig.clientConfig.configuration);
exports.getUiBackendBaseUrl = () => Promise.resolve(serverConfig.uiBackendBaseUrl);
exports.getGroundskeeperBaseUrl = () => Promise.resolve(serverConfig.groundskeeperBaseUrl);
exports.getButlerBaseUrl = () => Promise.resolve(serverConfig.butlerBaseUrl);

exports.getReportingEndpoints = (tenant, unit) => {
  return getReportingEndpointsFromButler(serverConfig.butlerBaseUrl, tenant, unit);
};
