/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import { TimeConfig, TagFilter, MobileAppPaginatedBeaconGroupsItem, OrderDirection } from '@instana/types';
import { Link, Button } from '@instana/components';

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
import { useLinkToAnalyze, useLinkToCrash } from 'in-mobile-apps/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

interface OriginLabelProp {
  item: MobileAppPaginatedBeaconGroupsItem;
  mobileAppId: string;
  viewId: string;
}

function OriginLabel({ item, mobileAppId, viewId }: OriginLabelProp) {
  const getLinkToMobileAppCrash = useLinkToCrash();
  let label = item?.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }
  let errLocationLabel = label?.split('\n')[0];

  return (
    <Link
      href={getLinkToMobileAppCrash(mobileAppId, {
        crashId: label,
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
    label: t('in-mobile-apps:dashboard.tabs.crashes.crashesLabelErrorMessage'),
    getContent: (
      item: MobileAppPaginatedBeaconGroupsItem,
      { mobileAppId, viewId }: { mobileAppId: string; viewId: string }
    ) => {
      return <OriginLabel item={item} mobileAppId={mobileAppId} viewId={viewId} />;
    }
  },
  {
    id: 'errorType',
    label: t('in-mobile-apps:dashboard.tabs.crashes.crashesLabelErrorType'),
    getContent: (item: MobileAppPaginatedBeaconGroupsItem) => {
      let errorTypeLabel = item?.name?.replace(/^"|"$/g, '')?.split('\\n')[1];
      errorTypeLabel = errorTypeLabel?.length ? errorTypeLabel : 'Not available';
      return <>{errorTypeLabel}</>;
    }
  },
  {
    id: 'lowestAppVersionNumber',
    label: t('in-mobile-apps:dashboard.tabs.crashes.crashesLabelLowestAppVersion'),
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
    label: t('in-mobile-apps:dashboard.tabs.crashes.crashesLabelHighestAppVersion'),
    getContent: (item: MobileAppPaginatedBeaconGroupsItem) => {
      let highestAppVersion =
        item?.metrics?.highestAppVersionNumber[0][1] > 0
          ? convertAppVersionNumberToAppVersionString(BigInt(item?.metrics?.highestAppVersionNumber[0][1].toString()))
          : 'Not available';
      return <>{highestAppVersion}</>;
    }
  },
  {
    id: 'crashesAgg',
    label: t('in-mobile-apps:dashboard.tabs.crashes.crashesLabelOccurrences'),
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
          metrics={item?.metrics?.crashes}
          metric={item?.metrics?.crashesAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'uniqueUsersOrSessionsAgg',
    label: t('in-mobile-apps:dashboard.tabs.crashes.crashesLabelAffectedUsers'),
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
    title: t('in-mobile-apps:dashboard.noDataAvailable.crashesTitle'),
    description: t('in-mobile-apps:dashboard.noDataAvailable.crashesDescription'),
    changeExplanation
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    mobileAppIdUrlParameter,
    tagFiltersInDashboardUrlParameter,
    sessionIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'crashesAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: '/crashes'
});

export interface CrashesProp {
  timeConfig?: TimeConfig;
  tagFilters?: TagFilter[];
  mobileAppId: string;
  mobileAppLabel: string;
}

export default function Crashes({ timeConfig, tagFilters, mobileAppId, mobileAppLabel }: CrashesProp) {
  const tagCatalogCrash = useTagCatalog('crash');

  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  const rightHeader = (
    <Button
      kind="secondary"
      href={
        tagCatalogCrash &&
        getLinkToMobileAppAnalyze({
          beaconType: 'crash',
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters,
            tagCatalog: tagCatalogCrash
          }),
          groupBy: defaultGroupings.crash
        })
      }
      style={{ marginRight: '0.5rem' }}
    >
      {t('in-mobile-apps:dashboard.tabs.crashes.crashesButtonAnalyzeCrashes')}
    </Button>
  );

  tagFilters = tagFilters?.concat({
    name: 'mobileBeacon.type',
    operator: 'EQUALS',
    stringValue: 'crash',
    type: 'TAG_FILTER',
    entity: 'NOT_APPLICABLE'
  });

  return (
    <Fragment>
      <>
        <ServerTableWithUrlState
          get={getTableData}
          mobileAppId={mobileAppId}
          tagFilters={tagFilters}
          timeConfig={timeConfig}
          cardTitle={t('in-mobile-apps:dashboard.tabs.crashes.crashesTableTitle')}
          rightHeader={rightHeader}
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
  orderBy = 'crashesAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}: GetTableDataProp) {
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([
      {
        name: 'mobileBeacon.crash.groupLabel',
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
      groupbyTag: 'mobileBeacon.crash.groupLabel'
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
      crashesAgg: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      },
      crashes: {
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
