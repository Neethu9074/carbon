import { getApplicationIdTagFilter } from 'in-applications/alerting/tagFilterUtils';

export function getHistoricThresholdMetricsConfiguration({
  applicationId,
  aggregation,
  metric,
  tagFilters,
  timeConfig,
  granularity,
  boundaryScope
}) {
  return Object.freeze({
    timeConfig,
    tagFilters: [...tagFilters, getApplicationIdTagFilter({ applicationId, boundaryScope })],
    metrics: {
      threshold: {
        metric,
        granularity,
        aggregation
      }
    }
  });
}

export function getBaselineMetricsConfiguration({
  applicationId,
  aggregation,
  tagFilters,
  granularity,
  seasonality,
  boundaryScope
}) {
  return Object.freeze({
    to: Date.now(),
    metrics: {
      baseline: {
        metric: 'latency',
        granularity,
        aggregation
      }
    },
    tagFilters: [...tagFilters, getApplicationIdTagFilter({ applicationId, boundaryScope })],
    seasonality
  });
}
