/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
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
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { useLinkToAnalyze, useLinkToCustomEvent } from 'in-mobile-apps/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

interface CustomEventLabelProp {
  item: MobileAppPaginatedBeaconGroupsItem;
  mobileAppId: string;
  viewId?: string;
}

function CustomEventLabel({ item, mobileAppId, viewId }: CustomEventLabelProp) {
  const getLinkToMobileAppCustomEvent = useLinkToCustomEvent();
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      href={getLinkToMobileAppCustomEvent(mobileAppId, {
        viewId,
        customEventId: label
      })}
    >
      {label}
    </Link>
  );
}

interface CustomEventListProp extends ServerTablePresenterProps<MobileAppPaginatedBeaconGroupsItem> {
  mobileAppId: string;
  result: any;
  timeConfig: TimeConfig;
  viewId?: string;
}

const columnDefinitions: Array<ColumnDefinition<MobileAppPaginatedBeaconGroupsItem, CustomEventListProp>> = [
  {
    id: 'name',
    label: t('in-mobile-apps:dashboard.tabs.customEvents.customEventsLabelEventName'),
    getContent(item, { mobileAppId, viewId }) {
      return <CustomEventLabel item={item} mobileAppId={mobileAppId} viewId={viewId} />;
    }
  },
  {
    id: 'occurrencesAgg',
    label: t('in-mobile-apps:dashboard.tabs.customEvents.customEventsLabelOccurrences'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.occurrences}
          metric={item.metrics.occurrencesAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'usersAgg',
    label: t('in-mobile-apps:dashboard.tabs.customEvents.customEventsLabelUsers'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.users}
          metric={item.metrics.usersAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-mobile-apps:dashboard.noDataAvailable.customEventsTitle'),
    description: t('in-mobile-apps:dashboard.noDataAvailable.customEventsDescription'),
    changeExplanation
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    mobileAppIdUrlParameter,
    tagFiltersInDashboardUrlParameter,
    viewIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'occurrencesAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: '/customEvents'
});

export interface CustomEventsProp {
  timeConfig?: TimeConfig;
  tagFilters?: TagFilter[];
  mobileAppId: string;
  mobileAppLabel: string;
}

export default function CustomEvents({ timeConfig, tagFilters, mobileAppId, mobileAppLabel }: CustomEventsProp) {
  const tagCatalogCustom = useTagCatalog('custom');
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  const rightHeader = (
    <Button
      kind="secondary"
      href={
        tagCatalogCustom &&
        getLinkToMobileAppAnalyze({
          beaconType: 'custom',
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters,
            tagCatalog: tagCatalogCustom
          }),
          groupBy: defaultGroupings.custom
        })
      }
      style={{ marginRight: '0.5rem' }}
    >
      {t('in-mobile-apps:dashboard.tabs.customEvents.customEventsButtonAnalyzeCustomEvents')}
    </Button>
  );

  return (
    <>
      <ServerTableWithUrlState
        get={getTableData}
        mobileAppId={mobileAppId}
        tagFilters={tagFilters}
        timeConfig={timeConfig}
        cardTitle={t('in-mobile-apps:dashboard.tabs.customEventsLabel')}
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
  orderBy = 'occurrencesAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}: GetTableDataProp) {
  tagFilters = tagFilters.concat([
    {
      name: 'mobileBeacon.type',
      stringValue: 'custom',
      operator: 'EQUALS',
      type: 'TAG_FILTER',
      entity: 'NOT_APPLICABLE'
    }
  ]);
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([
      {
        name: 'mobileBeacon.customEvent.name',
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
      groupbyTag: 'mobileBeacon.customEvent.name'
    },
    metrics: {
      occurrencesAgg: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      },
      occurrences: {
        metric: 'beaconCount',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      usersAgg: {
        metric: 'uniqueUsersOrSessions',
        aggregation: 'DISTINCT_COUNT'
      },
      users: {
        metric: 'uniqueUsersOrSessions',
        aggregation: 'DISTINCT_COUNT',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}
