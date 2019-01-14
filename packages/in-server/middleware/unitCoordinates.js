const serverConfig = require('../serverConfig');
const errorPages = require('../errorPages');

module.exports = exports = function enrichRequestWithTenantAndUnit(req, res, next) {
  const coords = getTenantUnitCoordinates(req);
  if (!coords) {
    console.log(`Could not determine tenant unit coordinates from hostname ${req.hostname}`);
    errorPages.send404(req, res);
    return;
  }

  req.tenant = coords.tenant;
  req.unit = coords.unit;

  next();
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
