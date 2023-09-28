/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeConfig, TagFilter, MobileAppPaginatedBeaconGroupsItem } from '@instana/types';
import { Link } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
// @ts-expect-error Could not find a declaration file for module
import { mobileAppIdUrlParameter, viewIdUrlParameter } from 'in-mobile-apps/navigation/urlParameters';
// @ts-expect-error Could not find a declaration file for module
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Could not find a declaration file for module
import { tagFiltersInDashboardUrlParameter } from 'in-mobile-apps/navigation/urlParameters';
// @ts-expect-error Could not find a declaration file for module
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
// @ts-expect-error Could not find a declaration file for module
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
// @ts-expect-error Could not find a declaration file for module
import emptyListExplanation from 'in-mobile-apps/emptyListExplanation';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useGetLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-mobile-apps:dashboard.tabs.nameLabel'),
    getContent(item: MobileAppPaginatedBeaconGroupsItem, { mobileAppId }: { mobileAppId: string }) {
      let label = item.name;
      try {
        label = String(JSON.parse(label));
      } catch (e) {
        // ignore
      }

      return <LabelLink mobileAppId={mobileAppId} label={label} />;
    }
  },
  {
    id: 'viewsAgg',
    label: t('in-mobile-apps:dashboard.tabs.occurrencesLabel'),
    defaultOrderDirection: 'DESC',
    getContent(
      item: MobileAppPaginatedBeaconGroupsItem,
      { result, timeConfig }: { result: any; timeConfig: TimeConfig }
    ) {
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

interface LabelLinkProp {
  mobileAppId: string;
  label: string;
}

function LabelLink({ mobileAppId, label }: LabelLinkProp) {
  const linkToMobileAppHref = useGetLinkToMobileApp(mobileAppId, {
    viewId: label,
    tabPath: '/summary'
  });

  return <Link href={linkToMobileAppHref}>{label}</Link>;
}

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-mobile-apps:dashboard.noDataAvailable.viewsTitle'),
    description: t('in-mobile-apps:dashboard.noDataAvailable.viewsDescription'),
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

interface ViewsProp {
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
  mobileAppId: string;
}

export default function Views({ timeConfig, tagFilters, mobileAppId }: ViewsProp) {
  return (
    <>
      <ServerTableWithUrlState
        get={getTableData}
        mobileAppId={mobileAppId}
        tagFilters={tagFilters}
        cardTitle={t('in-mobile-apps:dashboard.tabs.viewsLabel')}
        timeConfig={timeConfig}
      />
    </>
  );
}

interface GetTableDataProp {
  query: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: string;
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'viewsAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}: GetTableDataProp) {
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([
      {
        name: 'mobileBeacon.view.name',
        stringValue: query,
        operator: 'CONTAINS',
        type: 'TAG_FILTER',
        entity: 'NOT_APPLICABLE'
      }
    ]);
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
