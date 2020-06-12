import { getApplicationIdTagFilter } from 'in-applications/alerting/tagFilterUtils';

export function getThresholdQuery({
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
    metric: {
      metric,
      granularity,
      aggregation
    },
    seasonality,
    fallbackOnError
  });
}
