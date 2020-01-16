import { errorCount, statusCodeCount } from 'in-websites/eum-alerting/constants';

export function getMetricConfiguration(websiteId, aggregation, metric, tagFilters, timeConfig, granularity) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  return Object.freeze({
    timeConfig,
    tagFilters: tagFiltersWithWebsiteId,
    metrics: {
      threshold: {
        metric,
        granularity,
        aggregation
      }
    }
  });
}

export function getMetricsBaselineConfiguration(websiteId, aggregation, tagFilters, granularity, seasonality) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  return Object.freeze({
    to: Date.now(),
    metrics: {
      baseline: {
        metric: 'onLoadTime',
        granularity,
        aggregation
      }
    },
    tagFilters: tagFiltersWithWebsiteId,
    seasonality
  });
}

export function getMetricConfigurationForErrors(
  websiteId,
  aggregation,
  metric,
  stringValue,
  operator,
  tagFilters,
  timeConfig,
  granularity
) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  const errorFilter = { name: 'beacon.error.message', operator, stringValue };
  return Object.freeze({
    timeConfig,
    tagFilters: metric === errorCount ? [...tagFiltersWithWebsiteId, errorFilter] : tagFiltersWithWebsiteId,
    metrics: {
      threshold: {
        metric,
        granularity,
        aggregation,
        numeratorFilter: errorFilter
      }
    }
  });
}

export function getMetricConfigurationForStatusCode(
  websiteId,
  aggregation,
  metric,
  stringValue,
  operator,
  tagFilters,
  timeConfig,
  granularity
) {
  const tagFiltersWithWebsiteId = [...tagFilters, getWebsiteIdTagFilter(websiteId)];
  const statusCodeFilter = { name: 'beacon.http.status', operator, stringValue };
  return Object.freeze({
    timeConfig,
    tagFilters: metric === statusCodeCount ? [...tagFiltersWithWebsiteId, statusCodeFilter] : tagFiltersWithWebsiteId,
    metrics: {
      threshold: {
        metric,
        granularity,
        aggregation,
        numeratorFilter: statusCodeFilter
      }
    }
  });
}

function getWebsiteIdTagFilter(websiteId) {
  return Object.freeze({
    name: 'beacon.website.id',
    operator: 'EQUALS',
    stringValue: websiteId
  });
}
