const rp = require('request-promise');

const { getReportingEndpointsFromButler } = require('../reportingEndpoints.js');
const getFeatureFlagDefinitions = require('./featureFlags');
const serverConfig = require('../../serverConfig.js');
const cache = require('../loadingCache').createLoadingCache({ ttl: serverConfig.consul.cacheExpiry });

console.log('Initializing Consul resolver with config', serverConfig.consul);

exports.getUiBackendBaseUrl = (tenant, unit) =>
  cache(`getUiBackendBaseUrl:${tenant}:${unit}`, () => {
    return lookupServiceBaseUrl(`${tenant}-${unit}-ui-backend`);
  });

exports.getGroundskeeperBaseUrl = () =>
  cache(`groundskeeper`, () => {
    return lookupServiceBaseUrl(`groundskeeper`);
  });

const getButlerBaseUrl = () =>
  cache(`butler`, () => {
    return lookupServiceBaseUrl(`butler`);
  });
exports.getButlerBaseUrl = getButlerBaseUrl;

exports.getBaseUrl = (tenant, unit) =>
  Promise.resolve(`https://${unit}-${tenant}.${serverConfig.clientConfig.tenantUnitDomainSuffix}`);

exports.getButlerDomain = (tenant, unit) =>
  Promise.resolve(`${unit}-${tenant}.${serverConfig.clientConfig.tenantUnitDomainSuffix}`);

exports.getFeatureFlags = (tenant, unit) =>
  cache(`getFeatureFlags:${tenant}:${unit}`, () => {
    const featureFlags = getFeatureFlagDefinitions(tenant, unit).map(definition => {
      if (definition.consulKey) {
        return getBooleanSetting(definition.consulKey, definition.defaultValue).then(value => ({
          key: definition.uiClientKey,
          value
        }));
      }

      return Promise.resolve({
        key: definition.uiClientKey,
        value: definition.defaultValue
      });
    });

    return Promise.all(featureFlags).then(resolvedFeatureFlags =>
      resolvedFeatureFlags.reduce((agg, { key, value }) => {
        agg[key] = value;
        return agg;
      }, {})
    );
  });

exports.getConfiguration = (tenant, unit) =>
  cache(`getConfiguration:${tenant}:${unit}`, () => {
    return getIntSetting(`settings/${tenant}-${unit}/MAX_ALLOWED_ALERTINGS_CONFIGURATIONS`, 200).then(
      maxAllowedAlertingConfigurations => ({
        maxAllowedAlertingConfigurations
      })
    );
  });

exports.getReportingEndpoints = (tenant, unit) => {
  return getButlerBaseUrl().then(butlerBaseUrl => {
    return getReportingEndpointsFromButler(butlerBaseUrl, tenant, unit);
  });
};

function lookupServiceBaseUrl(serviceName) {
  return rp({
    method: 'GET',
    url: `${serverConfig.consul.baseUrl}/v1/catalog/service/${serviceName}`,
    json: true,
    simple: true,
    timeout: 5000,
    resolveWithFullResponse: false
  }).then(services => {
    if (services.length === 0) {
      const error = new Error(`Consul lookup returned zero results for service name: ${serviceName}`);
      error.ignoreStackTrace = true;
      error.notFound = true;
      return Promise.reject(error);
    }
    const service = services[0];
    let host = service.ServiceAddress;
    // Prefer DNS resolution.
    if (service.NodeMeta && service.NodeMeta.host) {
      host = service.NodeMeta.host;
    }
    const port = service.ServicePort;
    const scheme = port === 443 ? 'https' : 'http';
    return `${scheme}://${host}:${port}`;
  });
}

function getBooleanSetting(path, notDefinedFallback) {
  return getSetting(path, notDefinedFallback, str => str === 'true');
}

function getIntSetting(path, notDefinedFallback) {
  return getSetting(path, notDefinedFallback, str => {
    const v = parseInt(str, 10);
    if (isNaN(v)) {
      const error = new Error(
        `Could not parse integer setting retrieved from Consul at path ${path}. Received value: ${str}`
      );
      error.ignoreStackTrace = true;
      throw error;
    }
    return v;
  });
}

function getSetting(path, notDefinedFallback, valueParser) {
  return rp({
    method: 'GET',
    url: `${serverConfig.consul.baseUrl}/v1/kv/${path}`,
    json: true,
    simple: false,
    timeout: 5000,
    resolveWithFullResponse: true
  }).then(response => {
    if (response.statusCode === 404) {
      return notDefinedFallback;
    }

    if (response.statusCode < 200 || response.statusCode > 299) {
      const error = new Error(
        `Retrieval of setting from consul at path ${path} failed. Received status code ${
          response.statusCode
        } from Consul API.`
      );
      error.ignoreStackTrace = true;
      return Promise.reject(error);
    }

    if (response.body.length === 0) {
      return notDefinedFallback;
    }

    return valueParser(Buffer.from(response.body[0].Value, 'base64').toString('utf8'));
  });
}
