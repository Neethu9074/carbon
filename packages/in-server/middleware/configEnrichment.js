const { getUnitInfo } = require('../services/availableUnits');
const configResolver = require('../services/config');
const errorPages = require('../errorPages');

module.exports = exports = function enrichRequestWithConfig(req, res, next) {
  configResolver
    .getUiBackendBaseUrl(req.tenant, req.unit)
    .then(
      uiBackendBaseUrl => {
        req.uiBackendBaseUrl = uiBackendBaseUrl;

        return Promise.all([
          configResolver.getClientConfig(req.tenant, req.unit),
          configResolver.getBaseUrl(req.tenant, req.unit)
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
          return handleUiBackendNotFound(req.tenant, req.unit, req, res);
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
