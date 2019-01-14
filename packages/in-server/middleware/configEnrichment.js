const { getUnitInfo } = require('../services/availableUnits');
const configResolver = require('../services/config');
const serverConfig = require('../serverConfig');
const errorPages = require('../errorPages');

module.exports = exports = function enrichRequestWithConfig(req, res, next) {
  const coords = getTenantUnitCoordinates(req);
  if (!coords) {
    console.log(`Could not determine tenant unit coordinates from hostname ${req.hostname}`);
    errorPages.send404(req, res);
    return;
  }

  req.tenant = coords.tenant;
  req.unit = coords.unit;

  configResolver
    .getUiBackendBaseUrl(coords.tenant, coords.unit)
    .then(
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
        if (error.notFound) {
          return handleUiBackendNotFound(coords.tenant, coords.unit, req, res);
        } else {
          logError(error);
          errorPages.send500(req, res);
        }
      }
    )
    .catch(error => {
      logError(error);
      errorPages.send500(req, res);
    });
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

function handleUiBackendNotFound(tenant, unit, req, res) {
  return getUnitInfo(tenant, unit).then(
    info => {
      if (!info) {
        console.log(`Received request for unknown tenant %s / unit %s`, tenant, unit);
        errorPages.send404(req, res);
      } else if (info.hasLicense) {
        errorPages.sendMaintenance(req, res);
      } else {
        console.log(`Received request for tenant %s / unit %s without an active license (and no running ui-backend).`, tenant, unit);
        errorPages.send404(req, res);
      }
    },
    error => {
      logError(error);
      errorPages.sendMaintenance(req, res);
    }
  );
}
