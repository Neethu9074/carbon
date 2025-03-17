/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// eslint-disable-next-line no-restricted-imports
import sharedUrlUtils from 'in-server/src/services/sharedUrlUtils';
import { config } from 'in-services/config';

export function getBaseUrl(tenant, unit) {
  return sharedUrlUtils.getBaseUrl(tenant, unit, config);
}

const hrefAnalysisElement = document.createElement('a');

export function linkToTenantUnit(href, tenant, unit) {
  hrefAnalysisElement.href = href;
  return `${getBaseUrl(tenant, unit)}/${hrefAnalysisElement.hash}`;
}
