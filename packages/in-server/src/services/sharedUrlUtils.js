/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const subdomainUrlFormat = '$unit-$tenant.$baseDomain';
exports.subdomainUrlFormat = subdomainUrlFormat;

// (additional & optional) url format for on-premise operator based installations only
const pathUrlFormat = '$baseDomain/$tenant/$unit';
exports.pathUrlFormat = pathUrlFormat;

exports.isUrlFormatWithPathStrategy = function isPathStrategy(urlFormat) {
  return urlFormat === pathUrlFormat;
};

exports.getRawBaseUrl = (tenant, unit, clientConfig) => {
  return (clientConfig?.urlFormatPathStyle ? pathUrlFormat : subdomainUrlFormat)
    .replace('$unit', unit)
    .replace('$tenant', tenant)
    .replace('$baseDomain', clientConfig.tenantUnitDomainSuffix);
};

// urlFormat requires below variables
exports.getBaseUrl = (tenant, unit, clientConfig) => {
  const url = this.getRawBaseUrl(tenant, unit, clientConfig);
  return `https://${url}`;
};
