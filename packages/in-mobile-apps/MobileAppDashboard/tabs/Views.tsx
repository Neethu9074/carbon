/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig, TagFilter, MobileAppPaginatedBeaconGroupsItem, OrderDirection } from '@instana/types';
import { Link } from '@instana/components';

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
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { mobileAppScreenRenderingDurationEnabled } from 'in-services/featureFlags';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { useGetLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { ms, number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

interface ViewListProp extends ServerTablePresenterProps<MobileAppPaginatedBeaconGroupsItem> {
  mobileAppId: string;
  result: any;
  timeConfig: TimeConfig;
}

const columnScreenRendering: Array<ColumnDefinition<MobileAppPaginatedBeaconGroupsItem, ViewListProp>> =
  mobileAppScreenRenderingDurationEnabled
    ? [
        {
          id: 'viewChangeDurationAgg',
          label: t('in-mobile-apps:dashboard.tabs.screenRenderingDuration'),
          defaultOrderDirection: 'DESC',
          getContent(item, { result, timeConfig }) {
            return (
              <SparkChart
                loading={result?.progress?.loading}
                rollup={getSparkChartGranularity(timeConfig)}
                timeConfig={getResolvedTimeConfig(timeConfig, result)}
                aggregation="P75"
                metrics={item.metrics.viewChangeDuration}
                metric={item.metrics.viewChangeDurationAgg}
                tooltipFormatter={ms.compact}
              />
            );
          }
        }
      ]
    : [];

const columnDefinitions: Array<ColumnDefinition<MobileAppPaginatedBeaconGroupsItem, ViewListProp>> = [
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

      return <LabelLink mobileAppId={mobileAppId} label={label} />;
    }
  },
  ...columnScreenRendering,
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
  orderDirection: OrderDirection;
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
      },
      viewChangeDurationAgg: {
        metric: 'viewChangeDuration',
        aggregation: 'P75'
      },
      viewChangeDuration: {
        metric: 'viewChangeDuration',
        aggregation: 'P75',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}
