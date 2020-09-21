const { Pool } = require('pg');

const { getReportingEndpointsFromButler } = require('../reportingEndpoints.js');
const getFeatureFlagDefinitions = require('./featureFlags');
const serverConfig = require('../../serverConfig.js');
const cache = require('../loadingCache').createLoadingCache({
  ttl: serverConfig.instanactlCockroachDb.cacheExpiry || 60000
});

console.log('Initializing instanctl CockroachDB resolver against', serverConfig.instanactlCockroachDb.host);

const pool = new Pool({
  // client config options
  host: serverConfig.instanactlCockroachDb.host,
  port: serverConfig.instanactlCockroachDb.port,
  user: serverConfig.instanactlCockroachDb.user,
  password: serverConfig.instanactlCockroachDb.password,
  database: serverConfig.instanactlCockroachDb.database,
  statement_timeout: serverConfig.instanactlCockroachDb.statementTimeoutMillis || 15000,

  // pool config options
  connectionTimeoutMillis: serverConfig.instanactlCockroachDb.connectionTimeoutMillis || 30000,
  idleTimeoutMillis: serverConfig.instanactlCockroachDb.idleTimeoutMillis || 30000,
  max: serverConfig.instanactlCockroachDb.maxPooledConnections || 64
});

exports.getUiBackendBaseUrl = (tenant, unit) => Promise.resolve(`http://tu-${tenant}-${unit}-ui-backend:8600`);

exports.getGroundskeeperBaseUrl = () => Promise.resolve(serverConfig.groundskeeperBaseUrl);

exports.getButlerBaseUrl = () => Promise.resolve(serverConfig.butlerBaseUrl);

exports.getBaseUrl = (tenant, unit) =>
  Promise.resolve(`https://${unit}-${tenant}.${serverConfig.clientConfig.tenantUnitDomainSuffix}`);

exports.getButlerDomain = (tenant, unit) => Promise.resolve(getButlerDomain(tenant, unit));

exports.getFeatureFlags = (tenant, unit) =>
  cache(`getFeatureFlags:${tenant}:${unit}`, () => {
    const featureFlags = getFeatureFlagDefinitions(tenant, unit).map(definition => {
      if (definition.consulKey) {
        return getBooleanSetting(tenant, unit, definition.instanaCtlKey, definition.defaultValue).then(value => ({
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
    return getIntSetting(tenant, unit, 'MAX_ALLOWED_ALERTINGS_CONFIGURATIONS', 200).then(
      maxAllowedAlertingConfigurations => ({
        maxAllowedAlertingConfigurations
      })
    );
  });

exports.getReportingEndpoints = (req, tenant, unit) => {
  return getReportingEndpointsFromButler(req, serverConfig.butlerBaseUrl, tenant, unit);
};

function getButlerDomain(tenant, unit) {
  return `${unit}-${tenant}.${serverConfig.clientConfig.tenantUnitDomainSuffix}`;
}

function getBooleanSetting(tenant, unit, key, notDefinedFallback) {
  return getSetting({ tenant, unit, key, notDefinedFallback, valueParser: str => str === 'true' });
}

function getIntSetting(tenant, unit, key, notDefinedFallback) {
  return getSetting({
    tenant,
    unit,
    key,
    notDefinedFallback,
    valueParser: str => {
      const v = parseInt(str, 10);
      if (isNaN(v)) {
        const error = new Error(
          `Could not parse integer setting retrieved from CockroachDB for key ${key}. Received value: ${str}`
        );
        error.ignoreStackTrace = true;
        throw error;
      }
      return v;
    }
  });
}

const getSettingQuery = `
SELECT scope, value
FROM toggles
WHERE key = $1 AND ((scope = 'deployment' AND scopevalue = $2) OR (scope = 'tenantUnit' AND scopevalue = $3))
LIMIT 5
`.trim();

// from lowest to highest precendence, i.e. the more specific scopes come last
const scopePrecedence = ['deployment', 'tenantUnit'];

async function getSetting({ tenant, unit, key, notDefinedFallback, valueParser }) {
  const parameters = [key, serverConfig.instanaRegion, `${tenant}-${unit}`];
  try {
    const res = await pool.query({
      // Name defined to enable prepared statement support
      name: 'getSetting',
      text: getSettingQuery,
      values: parameters
    });

    let value = null;
    for (let scope of scopePrecedence) {
      for (let row of res.rows) {
        if (row.scope === scope) {
          value = row.value;
        }
      }
    }

    if (value == null) {
      return notDefinedFallback;
    }

    return valueParser(value);
  } catch (e) {
    const error = new Error(
      `Retrieval of settings from CockroachDB with parameters ${JSON.stringify(parameters)} failed. Received error: ${
        e.message
      }`
    );
    error.ignoreStackTrace = true;
    throw error;
  }
}
