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
      logError(req, error);
      errorPages.send500(req, res);
    }
  }
};

function logError(req, error) {
  if (error.ignoreStackTrace) {
    req.log.error('Failed to enrich config with config values:', error.message);
  } else {
    req.log.error('Failed to enrich config with config values', error);
  }
}

function handleUiBackendNotFound(tenant, unit, req, res) {
  return getUnitInfo(tenant, unit).then(
    info => {
      if (!info) {
        req.log.info(`Received request for unknown tenant / unit`);
        errorPages.send404(req, res);
      } else if (info.hasLicense) {
        errorPages.sendMaintenance(req, res);
      } else {
        req.log.info(`Received request for tenant / unit without an active license (and no running ui-backend).`);
        errorPages.send404(req, res);
      }
    },
    error => {
      logError(req, error);
      errorPages.sendMaintenance(req, res);
    }
  );
}
