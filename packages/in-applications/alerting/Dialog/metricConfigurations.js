export function getHistoricThresholdMetricsConfiguration({
  applicationId,
  aggregation,
  metric,
  tagFilters,
  timeConfig,
  granularity
}) {
  return Object.freeze({
    timeConfig,
    tagFilters: [...tagFilters, getApplicationIdTagFilter(applicationId)],
    metrics: {
      threshold: {
        metric,
        granularity,
        aggregation
      }
    }
  });
}

export function getBaselineMetricsConfiguration({ applicationId, aggregation, tagFilters, granularity, seasonality }) {
  return Object.freeze({
    to: Date.now(),
    metrics: {
      baseline: {
        metric: 'latency',
        granularity,
        aggregation
      }
    },
    tagFilters: [...tagFilters, getApplicationIdTagFilter(applicationId)],
    seasonality
  });
}

function getApplicationIdTagFilter(applicationId) {
  return Object.freeze({
    name: 'application.id',
    operator: 'EQUALS',
    stringValue: applicationId
  });
}
