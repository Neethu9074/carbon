/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const { activeResolver } = require('./resolvers/index');
const { subdomainUrlFormat } = require('./sharedUrlUtils');
const serverConfig = require('../serverConfig.js');

exports.getBaseUrl = activeResolver.getBaseUrl;
exports.getUiBackendBaseUrl = activeResolver.getUiBackendBaseUrl;
exports.getGroundskeeperBaseUrl = activeResolver.getGroundskeeperBaseUrl;
exports.getButlerBaseUrl = activeResolver.getButlerBaseUrl;
exports.getIntegrationBaseUrl = activeResolver.getIntegrationBaseUrl;
exports.getClientConfig = (req, tenant, unit) => {
  return Promise.all([
    activeResolver.getButlerDomain(tenant, unit),
    activeResolver.getFeatureFlags(tenant, unit),
    activeResolver.getConfiguration(tenant, unit),
    activeResolver.getReportingEndpoints(req, tenant, unit),
    activeResolver.getTenantInfo(req, tenant, unit)
  ]).then(([butlerDomain, featureFlags, configuration, reportingEndpoints, internalIds]) => ({
    butlerDomain,
    urlFormat: serverConfig.urlFormat ?? subdomainUrlFormat,
    tenantUnitDomainSuffix: serverConfig.clientConfig.tenantUnitDomainSuffix,
    region: serverConfig.clientConfig.region,
    instanaRegion: serverConfig.clientConfig.instanaRegion,
    tenant: tenant,
    tenantUnit: unit,
    featureFlags: featureFlags,
    configuration: configuration,

    agentEndpoint: reportingEndpoints.agentEndpoint,
    agentEndpointPort: reportingEndpoints.port,
    websiteScriptSource: reportingEndpoints.websiteScriptSource,
    websiteEndpoint: reportingEndpoints.websiteEndpoint,
    mobileEndpoint: reportingEndpoints.mobileEndpoint,
    serverlessEndpoint: reportingEndpoints.serverlessEndpoint,
    tenantId: internalIds?.tenantId,
    tenantUnitId: internalIds?.tenantUnitId,
    tenantUnitsCount: internalIds?.tenantUnitsCount
  }));
};
