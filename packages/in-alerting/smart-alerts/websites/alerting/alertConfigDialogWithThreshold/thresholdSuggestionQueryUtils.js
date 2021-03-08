/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { errorCount, statusCodeCount } from 'in-alerting/smart-alerts/websites/alerting/constants';

export function getThresholdQuery(
  websiteId,
  aggregation,
  metric,
  tagFilters,
  granularity,
  seasonality = null,
  fallbackOnError = false
) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  return Object.freeze({
    to: Date.now(),
    tagFilters: tagFiltersWithWebsiteId,
    metric: {
      metric,
      granularity,
      aggregation
    },
    seasonality,
    fallbackOnError
  });
}

export function getThresholdQueryForErrors(
  websiteId,
  aggregation,
  metric,
  stringValue,
  operator,
  tagFilters,
  granularity
) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  const errorFilter = { name: 'beacon.error.message', operator, stringValue };
  return Object.freeze({
    to: Date.now(),
    tagFilters: metric === errorCount ? [...tagFiltersWithWebsiteId, errorFilter] : tagFiltersWithWebsiteId,
    metric: {
      metric,
      granularity,
      aggregation,
      numeratorFilter: errorFilter
    },
    fallbackOnError: false
  });
}

export function getThresholdQueryForStatusCode(
  websiteId,
  aggregation,
  metric,
  stringValue,
  operator,
  tagFilters,
  granularity
) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  const statusCodeFilter = { name: 'beacon.http.status', operator, stringValue };
  return Object.freeze({
    to: Date.now(),
    tagFilters: metric === statusCodeCount ? [...tagFiltersWithWebsiteId, statusCodeFilter] : tagFiltersWithWebsiteId,
    metric: {
      metric,
      granularity,
      aggregation,
      numeratorFilter: statusCodeFilter
    },
    fallbackOnError: false
  });
}

export function getWebsiteIdTagFilter(websiteId) {
  return Object.freeze({
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: websiteId
  });
}
