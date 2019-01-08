const configResolver = require('../services/config');
const errorPages = require('../errorPages');
const serverConfig = require('../serverConfig');

module.exports = exports = function enrichRequestWithConfig(req, res, next) {
  const coords = getTenantUnitCoordinates(req);
  if (!coords) {
    console.log(`Could not determine tenant unit coordinates from hostname ${req.hostname}`);
    errorPages.send404(req, res);
    return;
  }

  req.tenant = coords.tenant;
  req.unit = coords.unit;

  configResolver.getUiBackendBaseUrl(coords.tenant, coords.unit).then(
    uiBackendBaseUrl => {
      req.uiBackendBaseUrl = uiBackendBaseUrl;

      return Promise.all([
        configResolver.getClientConfig(coords.tenant, coords.unit),
        configResolver.getBaseUrl(coords.tenant, coords.unit)
      ]).then(
        ([clientConfig, baseUrl]) => {
          req.clientConfig = clientConfig;
          req.uiClientBaseUrl = baseUrl;
          next();
        },
        error => {
          logError(error);
          errorPages.send500(req, res);
        }
      );
    },
    error => {
      logError(error);
      errorPages.sendMaintenance(req, res);
    }
  );
};

function getTenantUnitCoordinates(req) {
  // required for onprem deployments
  if (
    (!serverConfig.consul || !serverConfig.consul.baseUrl) &&
    serverConfig.clientConfig &&
    serverConfig.clientConfig.tenant
  ) {
    return {
      tenant: serverConfig.clientConfig.tenant,
      unit: serverConfig.clientConfig.tenantUnit
    };
  }

  if (!req.hostname) {
    return null;
  }

  const hostname = req.hostname.toLowerCase();
  if (hostname.indexOf(serverConfig.clientConfig.tenantUnitDomainSuffix) === -1) {
    return null;
  }

  // Don't do this completely via regex to avoid having to create a RegExp adhoc.
  // This would be kinda complicated because we would need to RegExp escape
  // the tenantUnitDomainSuffix.
  const unitSegment = req.hostname.split(`.${serverConfig.clientConfig.tenantUnitDomainSuffix}`)[0];
  const match = unitSegment.match(/(^|\.)([a-z0-9]+)-([a-z0-9]+)$/);
  if (!match) {
    return null;
  }

  return {
    tenant: match[3],
    unit: match[2]
  };
}

function logError(error) {
  if (error.ignoreStackTrace) {
    console.log('Failed to enrich config with config values: %s', error.message);
  } else {
    console.log('Failed to enrich config with config values', error);
  }
}
