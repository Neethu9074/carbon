/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { getSparkChartGranularity } from 'in-applications/metrics';
import { collationLanguage } from 'in-i18n';
import { GetWebsitesQuery, OrderDirection, PaginatedResult, Result, TimeConfig, WebsiteItem } from '@instana/types';

const getWebsites = createResultSubscriptionFactory<GetWebsitesQuery, Result<PaginatedResult<WebsiteItem>>>({
  eventId: 'getWebsites',
  trackSubscriptionStatistics: true
});
export default getWebsites;

interface GetWebsitesWithDefaultsProps {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
}

export function getWebsitesWithDefaults({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'pageViewsAgg',
  orderDirection = 'DESC',
  timeConfig
}: GetWebsitesWithDefaultsProps) {
  return getWebsites({
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
      pageViewsAgg: {
        metric: 'pageViews',
        aggregation: 'SUM'
      },
      pageViews: {
        metric: 'pageViews',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      onLoadTimeAgg: {
        metric: 'onLoadTime',
        aggregation: 'MEAN'
      },
      onLoadTime: {
        metric: 'onLoadTime',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      }
    },
    labelFilter: query,
    timeConfig
  });
}
