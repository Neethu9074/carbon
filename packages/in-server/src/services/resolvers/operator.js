/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const { getReportingEndpointsFromButler } = require('../reportingEndpoints.js');
const { getTenantInfoFromUiBackend } = require('../getTenantInfo.js');
const serverConfig = require('../../serverConfig.js');
const featureFlagDefinitions = require('./featureFlags');

exports.getFeatureFlags = () => {
  const presetWithEnabledFlags = featureFlagDefinitions.reduce((presetWithEnabledFlags, flag) => {
    const { uiClientKey: key, defaultValue } = flag;
    if (defaultValue) {
      presetWithEnabledFlags[key] = defaultValue;
    }
    return presetWithEnabledFlags;
  }, {});

  const configuredFlags = serverConfig?.clientConfig?.featureFlags ?? {};
  // overriding default preset with configured flags
  const mergedFlags = { ...presetWithEnabledFlags, ...configuredFlags };
  return Promise.resolve(mergedFlags);
};

exports.getBaseUrl = (tenant, unit) =>
  Promise.resolve(`https://${unit}-${tenant}.${serverConfig.clientConfig.tenantUnitDomainSuffix}`);
exports.getButlerDomain = (tenant, unit) => Promise.resolve(getButlerDomain(tenant, unit));
exports.getConfiguration = () => Promise.resolve(serverConfig.clientConfig.configuration);
exports.getUiBackendBaseUrl = (tenant, unit) => Promise.resolve(getUiBackendBaseUrl(tenant, unit));
exports.getGroundskeeperBaseUrl = () => Promise.resolve(serverConfig.groundskeeperBaseUrl);
exports.getButlerBaseUrl = () => Promise.resolve(serverConfig.butlerBaseUrl);

exports.getReportingEndpoints = (req, tenant, unit) => {
  return getReportingEndpointsFromButler(req, serverConfig.butlerBaseUrl, tenant, unit);
};

exports.getTenantInfo = (req, tenant, unit) => {
  return getTenantInfoFromUiBackend(req, tenant, unit);
};

function getButlerDomain(tenant, unit) {
  return `${unit}-${tenant}.${serverConfig.clientConfig.tenantUnitDomainSuffix}`;
}

function getUiBackendBaseUrl(tenantName, unitName) {
  for (const [namespace, units] of Object.entries(serverConfig.uiBackendNamespaces)) {
    for (const unit of units) {
      if (unit.tenant === tenantName && unit.unit === unitName) {
        return `http://tu-${unit.tenant}-${unit.unit}-ui-backend.${namespace}:8600`;
      }
    }
  }

  throw new Error(`Tenant (${tenantName}) & unit (${unitName}) combination not found in server configuration.`);
}
