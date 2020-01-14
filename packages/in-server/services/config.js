const { activeResolver } = require('./resolvers/index');
const serverConfig = require('../serverConfig.js');

exports.getBaseUrl = activeResolver.getBaseUrl;
exports.getUiBackendBaseUrl = activeResolver.getUiBackendBaseUrl;
exports.getGroundskeeperBaseUrl = activeResolver.getGroundskeeperBaseUrl;
exports.getClientConfig = (tenant, unit) => {
  return Promise.all([
    activeResolver.getButlerDomain(tenant, unit),
    activeResolver.getFeatureFlags(tenant, unit),
    activeResolver.getConfiguration(tenant, unit)
  ]).then(([butlerDomain, featureFlags, configuration]) => ({
    butlerDomain,
    agentEndpoint: resolveAgentEndpoint(serverConfig.clientConfig, tenant, unit),
    agentEndpointPort: resolveAgentEndpointPort(serverConfig.clientConfig),
    tenantUnitDomainSuffix: serverConfig.clientConfig.tenantUnitDomainSuffix,
    region: serverConfig.clientConfig.region,
    tenant: tenant,
    tenantUnit: unit,
    featureFlags: featureFlags,
    configuration: configuration,
    zendeskKey: serverConfig.zendeskKey
  }));
};

function resolveAgentEndpoint(clientConfig, tenant, unit) {
  // can be used for onprem and fullstack environments, GC and maybe others in the future
  if (clientConfig.agentEndpoint) {
    return clientConfig.agentEndpoint.replace('$TENANT', tenant).replace('$UNIT', unit);
  }
  // saas
  if (clientConfig.region) {
    return `saas-${clientConfig.region}.instana.io`;
  }
}

function resolveAgentEndpointPort(clientConfig) {
  // can be configured, e.g. for onprem
  if (clientConfig.agentEndpointPort) {
    return clientConfig.agentEndpointPort;
  }
  return '443';
}
