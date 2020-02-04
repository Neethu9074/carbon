const { activeResolver } = require('./resolvers/index');
const serverConfig = require('../serverConfig.js');
const agentEndpoint = require('./agentEndpoint');

exports.getBaseUrl = activeResolver.getBaseUrl;
exports.getUiBackendBaseUrl = activeResolver.getUiBackendBaseUrl;
exports.getGroundskeeperBaseUrl = activeResolver.getGroundskeeperBaseUrl;
exports.getButlerBaseUrl = activeResolver.getButlerBaseUrl;
exports.getClientConfig = (tenant, unit) => {
  return Promise.all([
    activeResolver.getButlerDomain(tenant, unit),
    activeResolver.getFeatureFlags(tenant, unit),
    activeResolver.getConfiguration(tenant, unit)
  ]).then(([butlerDomain, featureFlags, configuration]) => ({
    butlerDomain,
    agentEndpoint: agentEndpoint.resolveAgentEndpoint(tenant, unit),
    agentEndpointPort: agentEndpoint.resolveAgentEndpointPort(),
    tenantUnitDomainSuffix: serverConfig.clientConfig.tenantUnitDomainSuffix,
    region: serverConfig.clientConfig.region,
    tenant: tenant,
    tenantUnit: unit,
    featureFlags: featureFlags,
    configuration: configuration,
    zendeskKey: serverConfig.zendeskKey
  }));
};
