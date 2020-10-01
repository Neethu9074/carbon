const { getReportingEndpointsFromButler } = require('../reportingEndpoints.js');
const serverConfig = require('../../serverConfig.js');

exports.getFeatureFlags = () => Promise.resolve(serverConfig.clientConfig.featureFlags);
exports.getBaseUrl = (tenant, unit) =>
  Promise.resolve(`https://${unit}-${tenant}.${serverConfig.clientConfig.tenantUnitDomainSuffix}`);
exports.getButlerDomain = (tenant, unit) => Promise.resolve(getButlerDomain(tenant, unit));
exports.getConfiguration = () => Promise.resolve(serverConfig.clientConfig.configuration);
exports.getUiBackendBaseUrl = (tenant, unit) => Promise.resolve(`http://tu-${tenant}-${unit}-ui-backend:8600`);
exports.getGroundskeeperBaseUrl = () => Promise.resolve(serverConfig.groundskeeperBaseUrl);
exports.getButlerBaseUrl = () => Promise.resolve(serverConfig.butlerBaseUrl);

exports.getReportingEndpoints = (req, tenant, unit) => {
  return getReportingEndpointsFromButler(req, serverConfig.butlerBaseUrl, tenant, unit);
};

function getButlerDomain(tenant, unit) {
  return `${unit}-${tenant}.${serverConfig.clientConfig.tenantUnitDomainSuffix}`;
}
