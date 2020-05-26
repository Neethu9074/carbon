import { errorCount, statusCodeCount } from 'in-websites/alerting/constants';

export function getMetricConfiguration(
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
    metrics: {
      threshold: {
        metric,
        granularity,
        aggregation
      }
    },
    seasonality,
    fallbackOnError
  });
}

export function getMetricConfigurationForErrors(
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
    metrics: {
      threshold: {
        metric,
        granularity,
        aggregation,
        numeratorFilter: errorFilter
      }
    },
    fallbackOnError: false
  });
}

export function getMetricConfigurationForStatusCode(
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
    metrics: {
      threshold: {
        metric,
        granularity,
        aggregation,
        numeratorFilter: statusCodeFilter
      }
    },
    fallbackOnError: false
  });
}

function getWebsiteIdTagFilter(websiteId) {
  return Object.freeze({
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: websiteId
  });
}
