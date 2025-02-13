/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const serverConfig = require('../serverConfig.js');

// default url format for saas & operator
const subdomainUrlFormat = '$unit-$tenant.$baseDomain';

// (additional & optional) url format for on-premise operator based installations only
const pathUrlFormat = '$baseDomain/$tenant/$unit';

// request header for tenant&unit name i case using 'operatorUrlFormat'
exports.header = {
  tenant: 'x-instana-tenant',
  unit: 'x-instana-unit'
};

exports.isDefaultUrlFormat = function isDefaultUrlFormat() {
  // TODO adjust to having a flag in config instead
  return serverConfig.urlFormat === subdomainUrlFormat;
};

// urlFormat requires below variables
exports.getBaseUrl = (tenant, unit) => {
  const url = getUrlFormat()
    .replace('$unit', unit)
    .replace('$tenant', tenant)
    .replace('$baseDomain', serverConfig.clientConfig.tenantUnitDomainSuffix);
  return `https://${url}`;
};

function getUrlFormat() {
  return exports.isDefaultUrlFormat() ? subdomainUrlFormat : pathUrlFormat;
}
