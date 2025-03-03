/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const { Pool } = require('pg');
const fs = require('fs');

const { getReportingEndpointsFromButler } = require('../reportingEndpoints.js');
const { getTenantInfoFromUiBackend } = require('../getTenantInfo.js');
const featureFlagDefinitions = require('./featureFlags');
const serverConfig = require('../../serverConfig.js');
const { getBaseUrl, getRawBaseUrl } = require('../sharedUrlUtils.js');
const { logger } = require('../../logging');
const cache = require('../loadingCache').createLoadingCache({
  ttl: serverConfig.instanactlCockroachDb.cacheExpiry || 60000
});

logger.info(`Initializing instanctl CockroachDB resolver against ${serverConfig.instanactlCockroachDb.host}`);

const pool = new Pool(getPoolConfig());

exports.getGroundskeeperBaseUrl = () => Promise.resolve(serverConfig.groundskeeperBaseUrl);

exports.getButlerBaseUrl = () => Promise.resolve(serverConfig.butlerBaseUrl);

exports.getUiBackendBaseUrl = (tenant, unit) => Promise.resolve(getUiBackendBaseUrl(tenant, unit));

exports.getBaseUrl = (tenant, unit) =>
  Promise.resolve(
    getBaseUrl,
    serverConfig.clientConfig.tenantUnitDomainSuffix(tenant, unit, serverConfig.clientConfig)
  );

exports.getButlerDomain = (tenant, unit) => Promise.resolve(getButlerDomain(tenant, unit));

exports.getFeatureFlags = (tenant, unit) =>
  cache(`getFeatureFlags:${tenant}:${unit}`, () => {
    const featureFlags = featureFlagDefinitions.map(definition => {
      if (definition.instanaCtlKey) {
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
    return Promise.all([
      getIntSetting(tenant, unit, 'MAX_ALLOWED_ALERTINGS_CONFIGURATIONS', 200),
      getSetting({ tenant, unit, key: 'MIGRATED_TENANT_UNIT_URL', notDefinedFallback: '', valueParser: str => str })
    ]).then(values => {
      return {
        maxAllowedAlertingConfigurations: values[0],
        migratedTenantUnitUrl: values[1]
      };
    });
  });

exports.getReportingEndpoints = (req, tenant, unit) => {
  return getReportingEndpointsFromButler(req, serverConfig.butlerBaseUrl, tenant, unit);
};

exports.getTenantInfo = (req, tenant, unit) => {
  return getTenantInfoFromUiBackend(req, tenant, unit);
};

async function getUiBackendBaseUrl(tenant, unit) {
  const uibackendNamespace = await getSetting({
    tenant,
    unit,
    key: 'config.tu.namespace',
    notDefinedFallback: '',
    valueParser: str => str
  });

  if (uibackendNamespace) {
    return `http://tu-${tenant}-${unit}-ui-backend.${uibackendNamespace}:8600`;
  } else {
    return `http://tu-${tenant}-${unit}-ui-backend:8600`;
  }
}

function getButlerDomain(tenant, unit) {
  return getRawBaseUrl(tenant, unit, serverConfig.clientConfig);
}

function getBooleanSetting(tenant, unit, key, notDefinedFallback) {
  return getSetting({
    tenant,
    unit,
    key,
    notDefinedFallback,
    valueParser: str => toggleValueParser(str) || tenantUnitFeatureFlagForSharedComponentParser(tenant, unit, str)
  });
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

function toggleValueParser(str) {
  return str === 'true';
}

/**
 * This enables support for tenant unit specific feature flags for shared components.
 * Technically they are deployment scoped feature flags who's value is a
 * comma separated list of enabled tenant unit names or * for all.
 * The parser will resolve them to the boolean value for the active TU.
 * Define them with a boolean fallback in featureFlags.js and other places accordingly.
 *
 * DONT use these unless you have to share a tenant unit specific feature flag
 * with a shared component. Consider them deprecated for any other use.
 */
function tenantUnitFeatureFlagForSharedComponentParser(tenant, unit, str) {
  return str === '*' || str.split(/,|\s/).some(s => s === `${tenant}-${unit}`);
}

// Exported to allow unit testing
exports.getPoolConfig = getPoolConfig;
function getPoolConfig() {
  const poolConfig = {
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
  };

  const ssl = serverConfig.instanactlCockroachDb.ssl;
  if (ssl) {
    // For details of possible options see:
    // https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options
    // via
    // https://node-postgres.com/features/ssl
    poolConfig.ssl = {
      rejectUnauthorized: false,
      ...resolvePathToFileContent('cert', ssl.certPath),
      ...resolvePathToFileContent('ca', ssl.caPath),
      ...resolvePathToFileContent('key', ssl.keyPath),
      ...ssl
    };
  }

  return poolConfig;
}

function resolvePathToFileContent(key, path) {
  if (path) {
    return {
      [key]: fs.readFileSync(path, { encoding: 'utf8' })
    };
  }
  return {};
}

/** end connection pool and close any connections */
exports.shutdown = async () => {
  logger.info(`Trigger instanactl-resolver db connection pool closing.`);
  await pool.end();
  logger.info(`Instanactl-resolver db connection pool closed.`);
};
