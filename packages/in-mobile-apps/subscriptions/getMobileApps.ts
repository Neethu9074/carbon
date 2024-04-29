/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetMobileAppsQuery, Result, PaginatedResult, MobileAppItem, OrderDirection, TimeConfig } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { getSparkChartGranularity } from 'in-applications/metrics';
import { collationLanguage } from 'in-i18n';

const getMobileApps = createResultSubscriptionFactory<GetMobileAppsQuery, Result<PaginatedResult<MobileAppItem>>>({
  eventId: 'getMobileApps',
  trackSubscriptionStatistics: true
});
export default getMobileApps;

export interface GetMobileAppsWithDefaultsProp {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
}

export function getMobileAppsWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'sessionsAgg',
  orderDirection = 'DESC',
  timeConfig
}: GetMobileAppsWithDefaultsProp) {
  return getMobileApps({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection,
      collation: collationLanguage
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
      },
      crashesAgg: {
        metric: 'crashAffectedSessionRate',
        aggregation: 'MEAN'
      },
      crashes: {
        metric: 'crashAffectedSessionRate',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      }
    },
    labelFilter: query,
    timeConfig
  });
}
