/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { getSparkChartGranularity } from 'in-applications/metrics';

const getMobileApps = createResultSubscriptionFactory({
  eventId: 'getMobileApps',
  trackSubscriptionStatistics: true
});
export default getMobileApps;

export function getMobileAppsWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'sessionsAgg',
  orderDirection = 'DESC',
  timeConfig
}) {
  return getMobileApps({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      sessionsAgg: {
        metric: 'sessions',
        aggregation: 'SUM'
      },
      sessions: {
        metric: 'sessions',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      viewsAgg: {
        metric: 'views',
        aggregation: 'SUM'
      },
      views: {
        metric: 'views',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      }
    },
    labelFilter: query,
    timeConfig
  });
}
