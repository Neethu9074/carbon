const { Pool } = require('pg');
const sendRequest = require('request');

const { resolveAgentEndpoint, resolveAgentEndpointPort } = require('../agentEndpoint.js');
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

exports.getUiBackendBaseUrl = (tenant, unit) => Promise.resolve(`http://${tenant}-${unit}-ui-backend:8600`);

exports.getGroundskeeperBaseUrl = () => Promise.resolve('http://groundskeeper:8600');

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

exports.getAgentEndpointConfiguration = (tenant, unit) => {
  return new Promise(resolve => {
    sendRequest(
      {
        url: `${serverConfig.butlerBaseUrl}/tenants/${tenant}/unit/${unit}/acceptors`,
        timeout: 15000
      },
      (error, response, agentEndpointConfig) => {
        if (error || response.status < 200 || response.status >= 300) {
          console.log('Could not load agent endpoint config from butler.', response, agentEndpointConfig);
          resolve({ agentEndpoint: resolveAgentEndpoint(tenant, unit), port: resolveAgentEndpointPort() });
        } else {
          const parsedAgentEndpointConfig = getAgentEndpointConfigurationFromString(agentEndpointConfig);
          resolve({
            agentEndpoint: parsedAgentEndpointConfig.acceptorHost,
            port: parsedAgentEndpointConfig.acceptorPort
          });
        }
      }
    );
  });
};

function getAgentEndpointConfigurationFromString(str) {
  let agentEndpointConfig;
  try {
    agentEndpointConfig = JSON.parse(str);
  } catch (error) {
    agentEndpointConfig = null;
  }
  return agentEndpointConfig;
}

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
