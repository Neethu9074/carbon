/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { Fragment } from 'react';

import { TimeConfig, TagFilter, MobileAppPaginatedBeaconGroupsItem, OrderDirection } from '@instana/types';
import { Link, Tooltip, SvgIcon } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import { sessionIdUrlParameter, tagFiltersInDashboardUrlParameter } from 'in-mobile-apps/navigation/urlParameters';
// @ts-expect-error Could not find a declaration file for module
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
// @ts-expect-error Could not find a declaration file for module
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Could not find a declaration file for module
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
// @ts-expect-error Could not find a declaration file for module
import { mobileAppIdUrlParameter } from 'in-mobile-apps/navigation/urlParameters';
// @ts-expect-error Could not find a declaration file for module
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
// @ts-expect-error Could not find a declaration file for module
import changeExplanation from 'in-mobile-apps/emptyListExplanation';
// @ts-expect-error Could not find a declaration file for module
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useLinkToPerformance } from 'in-mobile-apps/navigation/paths';
import { number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

import locals from './AnrStackTraces.mless';

interface OriginLabelProp {
  item: MobileAppPaginatedBeaconGroupsItem;
  mobileAppId: string;
  viewId: string;
}

function OriginLabel({ item, mobileAppId, viewId }: OriginLabelProp) {
  const getLinkToAnr = useLinkToPerformance();
  let label = item?.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }
  let errLocationLabel = label?.split('\n')[0];

  return (
    <Link
      href={getLinkToAnr(mobileAppId, {
        anrId: label,
        viewId
      })}
    >
      {errLocationLabel}
    </Link>
  );
}

function convertAppVersionNumberToAppVersionString(appVersionNumber: bigint): string {
  const major_factor = BigInt(10 ** 12);
  const minor_factor = BigInt(10 ** 6);
  const major = appVersionNumber / major_factor;
  const minor = (appVersionNumber % major_factor) / minor_factor;
  const patch = appVersionNumber % minor_factor;

  return `${major}.${minor}.${patch}`;
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-mobile-apps:dashboard.tabs.performance.anrLabelLocation'),
    getContent: (
      item: MobileAppPaginatedBeaconGroupsItem,
      { mobileAppId, viewId }: { mobileAppId: string; viewId: string }
    ) => {
      return <OriginLabel item={item} mobileAppId={mobileAppId} viewId={viewId} />;
    }
  },
  {
    id: 'lowestAppVersionNumber',
    label: t('in-mobile-apps:dashboard.tabs.performance.anrLabelLowestAppVersion'),
    getContent: (item: MobileAppPaginatedBeaconGroupsItem) => {
      let lowestAppVersion =
        item?.metrics?.lowestAppVersionNumber[0][1] > 0
          ? convertAppVersionNumberToAppVersionString(BigInt(item?.metrics?.lowestAppVersionNumber[0][1].toString()))
          : 'Not available';
      return <>{lowestAppVersion}</>;
    }
  },
  {
    id: 'highestAppVersionNumber',
    label: t('in-mobile-apps:dashboard.tabs.performance.anrLabeHighestAppVersion'),
    getContent: (item: MobileAppPaginatedBeaconGroupsItem) => {
      let highestAppVersion =
        item?.metrics?.highestAppVersionNumber[0][1] > 0
          ? convertAppVersionNumberToAppVersionString(BigInt(item?.metrics?.highestAppVersionNumber[0][1].toString()))
          : 'Not available';
      return <>{highestAppVersion}</>;
    }
  },
  {
    id: 'anrsAgg',
    label: t('in-mobile-apps:dashboard.tabs.performance.anrLabelOccurrences'),
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
          metrics={item?.metrics?.anrs}
          metric={item?.metrics?.anrsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'uniqueUsersOrSessionsAgg',
    label: t('in-mobile-apps:dashboard.tabs.performance.anrLabelAffectedUsers'),
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
          aggregation="DISTINCT_COUNT"
          metrics={item?.metrics?.uniqueUsersOrSessions}
          metric={item?.metrics?.uniqueUsersOrSessionsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-mobile-apps:dashboard.noDataAvailable.anrTitle'),
    description: t('in-mobile-apps:dashboard.noDataAvailable.anrDescription'),
    changeExplanation
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    mobileAppIdUrlParameter,
    tagFiltersInDashboardUrlParameter,
    sessionIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'anrsAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: '/performance'
});

export interface AnrStackTracesProp {
  timeConfig?: TimeConfig;
  tagFilters?: TagFilter[];
  mobileAppId: string;
}

export default function AnrStackTraces({ timeConfig, tagFilters, mobileAppId }: AnrStackTracesProp) {
  //Only show ANR details for android beacons
  tagFilters = tagFilters?.concat([
    {
      name: 'mobileBeacon.performanceSubtype',
      operator: 'EQUALS',
      stringValue: 'App not responding or freezing',
      type: 'TAG_FILTER',
      entity: 'NOT_APPLICABLE'
    },
    {
      name: 'mobileBeacon.platform',
      operator: 'EQUALS',
      stringValue: 'Android',
      type: 'TAG_FILTER',
      entity: 'NOT_APPLICABLE'
    }
  ]);

  const rightHeader = (
    <div className={locals.cardHeader}>
      <label className={locals.label}>{t('in-mobile-apps:dashboard.tabs.performance.anrTableHeader')}</label>
      <Tooltip content={t('in-mobile-apps:dashboard.tabs.performance.anrTableTooltip')}>
        <SvgIcon size={'xs'} type={'lib_help_error_info_outline'} />
      </Tooltip>
    </div>
  );

  return (
    <Fragment>
      <>
        <ServerTableWithUrlState
          get={getTableData}
          mobileAppId={mobileAppId}
          tagFilters={tagFilters}
          timeConfig={timeConfig}
          cardTitle={rightHeader}
        />
      </>
      <Footer />
    </Fragment>
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
  orderBy = 'anrsAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}: GetTableDataProp) {
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([
      {
        name: 'mobileBeacon.anrStack.label',
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
      groupbyTag: 'mobileBeacon.anrStack.label'
    },
    metrics: {
      uniqueUsersOrSessionsAgg: {
        metric: 'uniqueUsersOrSessions',
        aggregation: 'DISTINCT_COUNT'
      },
      uniqueUsersOrSessions: {
        metric: 'uniqueUsersOrSessions',
        aggregation: 'DISTINCT_COUNT',
        granularity: getSparkChartGranularity(timeConfig)
      },
      anrsAgg: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      },
      anrs: {
        metric: 'beaconCount',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      lowestAppVersionNumber: {
        metric: 'appVersionNumber',
        aggregation: 'MIN'
      },
      highestAppVersionNumber: {
        metric: 'appVersionNumber',
        aggregation: 'MAX'
      }
    }
  });
}
