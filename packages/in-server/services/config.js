const { activeResolver } = require('./resolvers/index');
const serverConfig = require('../serverConfig.js');

exports.getBaseUrl = activeResolver.getBaseUrl;
exports.getUiBackendBaseUrl = activeResolver.getUiBackendBaseUrl;
exports.getGroundskeeperBaseUrl = activeResolver.getGroundskeeperBaseUrl;
exports.getClientConfig = (tenant, unit) => {
  return Promise.all([
    activeResolver.getButlerDomain(tenant, unit),
    activeResolver.getFeatureFlags(tenant, unit),
    activeResolver.getConfiguration(tenant, unit),
    activeResolver.getAgentEndpointConfiguration(tenant, unit)
  ]).then(([butlerDomain, featureFlags, configuration, agentEndpointConfiguration]) => ({
    butlerDomain,
    agentEndpoint: agentEndpointConfiguration.agentEndpoint,
    agentEndpointPort: agentEndpointConfiguration.port,
    tenantUnitDomainSuffix: serverConfig.clientConfig.tenantUnitDomainSuffix,
    region: serverConfig.clientConfig.region,
    tenant: tenant,
    tenantUnit: unit,
    featureFlags: featureFlags,
    configuration: configuration,
    zendeskKey: serverConfig.zendeskKey
  }));
};
