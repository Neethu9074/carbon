import React from 'react';

import {
  websiteIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  pageIdUrlParameter
} from 'in-websites/navigation/urlParameters';
import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import { number, ms } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import Link from 'in-components/Link';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item, { websiteId }) {
      let label = item.name;
      try {
        label = String(JSON.parse(label));
      } catch (e) {
        // ignore
      }

      return (
        <Link
          href$={getLinkToWebsite(websiteId, {
            pageId: label,
            tabPath: '/summary'
          })}
        >
          {label}
        </Link>
      );
    }
  },
  {
    id: 'pageViewsAgg',
    label: 'Page Views',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.pageViews}
          metric={item.metrics.pageViewsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'onLoadTimeAgg',
    label: 'onLoad Time',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.onLoadTime}
          metric={item.metrics.onLoadTimeAgg}
          tooltipFormatter={ms.compact}
        />
      );
    }
  },
  {
    id: 'errorsAgg',
    label: 'JS Errors',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.errors}
          metric={item.metrics.errorsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = withEmptyTableState({
  Component: createServerTableWithUrlState({
    paginationResettingUrlParameters: [
      ...timeConfigUrlParameters,
      websiteIdUrlParameter,
      tagFiltersInDashboardUrlParameter,
      pageIdUrlParameter
    ],
    columnDefinitions,
    defaultOrderBy: 'pageViewsAgg',
    defaultOrderDirection: 'DESC',
    pathSegment: '/pages'
  }),
  columnDefinitions,
  entityName: 'pages',
  changeExplanation: (explanation, props) => {
    return props.tagFilters && props.tagFilters.length > 1 ? `${explanation}  matching your filters` : explanation;
  }
});

export default function Pages({ timeConfig, tagFilters, websiteId }) {
  return (
    <ServerTableWithUrlState get={getTableData} websiteId={websiteId} tagFilters={tagFilters} timeConfig={timeConfig} />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'pageViewsAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}) {
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([{ name: 'beacon.page.name', stringValue: query, operator: 'CONTAINS' }]);
  }

  return getWebsitePaginatedBeaconGroups({
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
      groupbyTag: 'beacon.page.name'
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
      errorsAgg: {
        metric: 'errors',
        aggregation: 'SUM'
      },
      errors: {
        metric: 'errors',
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
    }
  });
}
