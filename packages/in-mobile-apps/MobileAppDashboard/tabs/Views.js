/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  mobileAppIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  viewIdUrlParameter
} from 'in-mobile-apps/navigation/urlParameters';
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import emptyListExplanation from 'in-mobile-apps/emptyListExplanation';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-mobile-apps:dashboard.tabs.nameLabel'),
    getContent(item, { mobileAppId }) {
      let label = item.name;
      try {
        label = String(JSON.parse(label));
      } catch (e) {
        // ignore
      }

      return (
        <Link
          href$={getLinkToMobileApp(mobileAppId, {
            viewId: label,
            tabPath: '/summary'
          })}
        >
          {label}
        </Link>
      );
    }
  },
  {
    id: 'viewsAgg',
    label: t('in-mobile-apps:dashboard.tabs.occurrencesLabel'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.views}
          metric={item.metrics.viewsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'views',
    emptyListExplanation
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    mobileAppIdUrlParameter,
    tagFiltersInDashboardUrlParameter,
    viewIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'viewsAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: '/views'
});

export default function Views({ timeConfig, tagFilters, mobileAppId }) {
  return (
    <Card>
      <ServerTableWithUrlState
        get={getTableData}
        mobileAppId={mobileAppId}
        tagFilters={tagFilters}
        timeConfig={timeConfig}
      />
    </Card>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'viewsAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}) {
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([{ name: 'mobileBeacon.view.name', stringValue: query, operator: 'CONTAINS' }]);
  }

  return getMobileAppPaginatedBeaconGroups({
    tagFilters,
    timeConfig,
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    group: {
      groupbyTag: 'mobileBeacon.view.name'
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
    }
  });
}
