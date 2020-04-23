import { getApplicationIdTagFilter } from 'in-applications/alerting/tagFilterUtils';

export function getMetricsConfiguration({
  applicationId,
  aggregation,
  metric,
  tagFilters,
  granularity,
  boundaryScope,
  seasonality = null,
  fallbackOnError = false
}) {
  return Object.freeze({
    to: Date.now(),
    tagFilters: [...tagFilters, getApplicationIdTagFilter({ applicationId, boundaryScope })],
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
