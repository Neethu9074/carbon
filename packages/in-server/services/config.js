const { activeResolver } = require('./resolvers/index');
const serverConfig = require('../serverConfig.js');

exports.getUiBackendBaseUrl = activeResolver.getUiBackendBaseUrl;
exports.getClientConfig = (tenant, unit) => {
  return Promise.all([
    activeResolver.getFeatureFlags(tenant, unit),
    activeResolver.getConfiguration(tenant, unit)
  ]).then(([featureFlags, configuration]) => ({
    butlerDomain: `${unit}-${tenant}${serverConfig.clientConfig.tenantUnitDomainSuffix}`,
    tenantUnitDomainSuffix: serverConfig.clientConfig.tenantUnitDomainSuffix,
    region: serverConfig.clientConfig.region,
    tenant: tenant,
    tenantUnit: unit,
    featureFlags: featureFlags,
    configuration: configuration
  }));
};
