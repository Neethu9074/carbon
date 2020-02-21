import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { getSparkChartGranularity } from 'in-applications/metrics';

const getApplications = createResultSubscriptionFactory({
  eventId: 'getApplications',
  trackSubscriptionStatistics: true
});
export default getApplications;

export function getApplicationsWithDefaults({
  timeConfig,
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'callsAgg',
  orderDirection = 'DESC'
}) {
  return getApplications({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      services: {
        metric: 'services',
        aggregation: 'DISTINCT_COUNT'
      },
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      },
      openIssues: {
        metric: 'openIssues',
        aggregation: 'DISTINCT_COUNT'
      },
      maxSeverity: {
        metric: 'maxSeverity',
        aggregation: 'MAX'
      }
    },
    filter: {
      label: query,
      timeConfig
    }
  });
}
