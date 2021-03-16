/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const { getUnitInfo } = require('../services/availableUnits');
const configResolver = require('../services/config');
const errorPages = require('../errorPages');

module.exports = exports = async function enrichRequestWithConfig(req, res, next) {
  try {
    const uiBackendBaseUrl = await configResolver.getUiBackendBaseUrl(req.tenant, req.unit);
    req.uiBackendBaseUrl = uiBackendBaseUrl;
    next();
  } catch (error) {
    if (error.notFound) {
      handleUiBackendNotFound(req.tenant, req.unit, req, res);
    } else {
      logError(error);
      errorPages.send500(req, res);
    }
  }
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
        console.log(
          `Received request for tenant %s / unit %s without an active license (and no running ui-backend).`,
          tenant,
          unit
        );
        errorPages.send404(req, res);
      }
    },
    error => {
      logError(error);
      errorPages.sendMaintenance(req, res);
    }
  );
}
