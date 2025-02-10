/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { config } from 'in-services/config';

const hrefAnalysisElement = document.createElement('a');

export function linkToTenantUnit(href, tenant, unit) {
  hrefAnalysisElement.href = href;
  return `${getBaseUrl(tenant, unit)}/${hrefAnalysisElement.hash}`;
}

function getBaseUrl(tenant, unit) {
  const url = config.urlFormat
    .replace('$unit', unit)
    .replace('$tenant', tenant)
    .replace('$baseDomain', config.clientConfig.tenantUnitDomainSuffix);
  return `https://${url}`;
}
