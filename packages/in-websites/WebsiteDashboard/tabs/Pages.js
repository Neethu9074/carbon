/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import {
  pageIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  websiteIdUrlParameter
} from 'in-websites/navigation/urlParameters';
import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import changeExplanation from 'in-websites/emptyListExplanation';
import { useLinkToWebsite } from 'in-websites/navigation/paths';
import { ms, number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import { collationLanguage, t } from 'in-i18n';
import Footer from 'in-components/Footer';

const PageLink = ({ item, websiteId }) => {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  const websiteHref = useLinkToWebsite(websiteId, {
    pageId: label,
    tabPath: '/summary'
  });

  return <Link href={websiteHref}>{label}</Link>;
};

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-websites:websiteDashboard.tabs.pagesLabelName'),
    getContent: (item, { websiteId }) => <PageLink item={item} websiteId={websiteId} />
  },
  {
    id: 'pageViewsAgg',
    label: t('in-websites:websiteDashboard.tabs.pagesLabelPageViews'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
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
    label: t('in-websites:websiteDashboard.tabs.pagesLabelOnLoadTime'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          // onLoadTime is not available when pages haven't received any loads
          metrics={item.metrics.onLoadTime || []}
          metric={item.metrics.onLoadTimeAgg}
          tooltipFormatter={ms.compact}
        />
      );
    }
  },
  {
    id: 'errorsAgg',
    label: t('in-websites:websiteDashboard.tabs.pagesLabelJSErrors'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
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

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-websites:websiteDashboard.noDataAvailable.pagesTitle'),
    description: t('in-websites:websiteDashboard.noDataAvailable.pagesDescription'),
    changeExplanation
  }),
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
});

export default function Pages({ timeConfig, tagFilters, websiteId }) {
  return (
    <>
      <ServerTableWithUrlState
        get={getTableData}
        websiteId={websiteId}
        tagFilters={tagFilters}
        cardTitle={t('in-websites:websiteDashboard.tabs.indexLabelPages')}
        timeConfig={timeConfig}
      />
      <Footer />
    </>
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
      direction: orderDirection,
      collation: collationLanguage
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
