/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const serverConfig = require('../serverConfig.js');

// urlFormat requires below variables and is defaulting to `$unit-$tenant.$baseDomain`
exports.getBaseUrl = (tenant, unit) => {
  const url = serverConfig.urlFormat
    .replace('$unit', unit)
    .replace('$tenant', tenant)
    .replace('$baseDomain', serverConfig.clientConfig.tenantUnitDomainSuffix);
  return `https://${url}`;
};
