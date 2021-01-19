/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { config } from 'in-services/config';

const hrefAnalysisElement = document.createElement('a');

export function linkToTenantUnit(href, tenant, unit) {
  hrefAnalysisElement.href = href;
  return `https://${unit}-${tenant}.${config.tenantUnitDomainSuffix}/${hrefAnalysisElement.hash}`;
}
