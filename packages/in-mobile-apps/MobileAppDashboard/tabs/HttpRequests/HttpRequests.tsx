/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TimeConfig, TagFilter, MobileAppPaginatedBeaconGroupsItem, OrderDirection } from '@instana/types';
import { Link, Button } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import { mobileAppIdUrlParameter, tagFiltersInDashboardUrlParameter } from 'in-mobile-apps/navigation/urlParameters';
// @ts-expect-error Could not find a declaration file for module
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
// @ts-expect-error Could not find a declaration file for module
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Could not find a declaration file for module
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
// @ts-expect-error Could not find a declaration file for module
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
// @ts-expect-error Could not find a declaration file for module
import { viewIdUrlParameter } from 'in-mobile-apps/navigation/urlParameters';
// @ts-expect-error Could not find a declaration file for module
import changeExplanation from 'in-mobile-apps/emptyListExplanation';
// @ts-expect-error Could not find a declaration file for module
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import { useLinkToAnalyze, useLinkToHttpRequest } from 'in-mobile-apps/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { ms, number, percentage } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

interface OriginLabelProp {
  item: MobileAppPaginatedBeaconGroupsItem;
  mobileAppId: string;
  viewId?: string;
}

function OriginLabel({ item, mobileAppId, viewId }: OriginLabelProp) {
  const getLinkToMobileAppHttpRequest = useLinkToHttpRequest();
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      href={getLinkToMobileAppHttpRequest(mobileAppId, {
        httpRequestId: label,
        viewId
      })}
    >
      {label}
    </Link>
  );
}

interface HttpRequestListProp extends ServerTablePresenterProps<MobileAppPaginatedBeaconGroupsItem> {
  mobileAppId: string;
  result: any;
  timeConfig: TimeConfig;
  viewId?: string;
}

const columnDefinitions: Array<ColumnDefinition<MobileAppPaginatedBeaconGroupsItem, HttpRequestListProp>> = [
  {
    id: 'name',
    label: t('in-mobile-apps:dashboard.tabs.originLabel'),
    getContent(item, { mobileAppId, viewId }) {
      return <OriginLabel item={item} mobileAppId={mobileAppId} viewId={viewId} />;
    }
  },
  {
    id: 'beaconCountAgg',
    label: t('in-mobile-apps:dashboard.tabs.callsLabel'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.beaconCount}
          metric={item.metrics.beaconCountAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'beaconDurationAgg',
    label: t('in-mobile-apps:dashboard.tabs.latencyLabel'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.beaconDuration}
          metric={item.metrics.beaconDurationAgg}
          tooltipFormatter={ms.compact}
        />
      );
    }
  },
  {
    id: 'beaconErrorRateAgg',
    label: t('in-mobile-apps:dashboard.tabs.errorsLabel'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.beaconErrorRate}
          metric={item.metrics.beaconErrorRateAgg}
          tooltipFormatter={percentage.detailed}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-mobile-apps:dashboard.noDataAvailable.httpRequestsTitle'),
    description: t('in-mobile-apps:dashboard.noDataAvailable.httpRequestsDescription'),
    changeExplanation
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    mobileAppIdUrlParameter,
    tagFiltersInDashboardUrlParameter,
    viewIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'beaconCountAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: '/httpRequests'
});

export interface HttpRequestsProp {
  timeConfig?: TimeConfig;
  tagFilters?: TagFilter[];
  mobileAppId: string;
  mobileAppLabel: string;
}

export default function HttpRequests({ timeConfig, tagFilters, mobileAppId, mobileAppLabel }: HttpRequestsProp) {
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  const rightHeader = (
    <Button
      kind="secondary"
      href={
        tagCatalogHttpRequest &&
        getLinkToMobileAppAnalyze({
          beaconType: 'httpRequest',
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters,
            tagCatalog: tagCatalogHttpRequest
          }),
          groupBy: defaultGroupings.httpRequest
        })
      }
      style={{ marginRight: '0.5rem' }}
    >
      {t('in-mobile-apps:dashboard.tabs.analyzeHTTPRequestsBtn')}
    </Button>
  );

  tagFilters = tagFilters?.concat({
    name: 'mobileBeacon.type',
    operator: 'EQUALS',
    stringValue: 'httpRequest',
    type: 'TAG_FILTER',
    entity: 'NOT_APPLICABLE'
  });

  return (
    <>
      <ServerTableWithUrlState
        get={getTableData}
        mobileAppId={mobileAppId}
        tagFilters={tagFilters}
        timeConfig={timeConfig}
        cardTitle={t('in-mobile-apps:dashboard.tabs.httpRequestLabel')}
        rightHeader={rightHeader}
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
  timeConfig: TimeConfig;
  tagFilters: TagFilter[];
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'beaconCountAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}: GetTableDataProp) {
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([
      {
        name: 'mobileBeacon.http.origin',
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
      groupbyTag: 'mobileBeacon.http.origin'
    },
    metrics: {
      beaconCountAgg: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      },
      beaconCount: {
        metric: 'beaconCount',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      beaconDurationAgg: {
        metric: 'beaconDuration',
        aggregation: 'MEAN'
      },
      beaconDuration: {
        metric: 'beaconDuration',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      },
      beaconErrorRateAgg: {
        metric: 'beaconErrorRate',
        aggregation: 'MEAN'
      },
      beaconErrorRate: {
        metric: 'beaconErrorRate',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}
