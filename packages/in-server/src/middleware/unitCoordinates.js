/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const { header, isDefaultUrlFormat } = require('../services/instanaUrls');
const serverConfig = require('../serverConfig');
const errorPages = require('../errorPages');

module.exports = exports = function enrichRequestWithTenantAndUnit(req, res, next) {
  const coords = getTenantUnitCoordinates(req);
  if (!coords) {
    req.log.info(`Could not determine tenant unit coordinates from hostname`);
    errorPages.send404(req, res);
    return;
  }

  req.tenant = coords.tenant;
  req.unit = coords.unit;

  next();
};

function getTenantUnitCoordinates(req) {
  return getFromConfig() || getFromHostname(req) || getFromHeader(req) || getFromQuery(req);
}

function getFromConfig() {
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
  return null;
}

function getFromHostname(req) {
  // for default url format tenant&unit can be read from hostname
  if (req.hostname && isDefaultUrlFormat()) {
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
}

function getFromHeader(req) {
  // for additional on-premise url format gateway is adding tenant&unit as request header
  if (!isDefaultUrlFormat() && req.get(header.tenant) && req.get(header.unit)) {
    return {
      tenant: req.get(header.tenant),
      unit: req.get(header.unit)
    };
  }
  return null;
}

function getFromQuery(req) {
  if (req.query.tenant && req.query.unit) {
    return {
      tenant: req.query.tenant,
      unit: req.query.unit
    };
  }
  return null;
}
