/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Button } from '@instana/components';
import { Link } from '@instana/legacy';

import {
  mobileAppIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  viewIdUrlParameter
} from 'in-mobile-apps/navigation/urlParameters';
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { useLinkToAnalyze, useLinkToCustomEvent } from 'in-mobile-apps/navigation/paths';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import changeExplanation from 'in-mobile-apps/emptyListExplanation';
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import { number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

function CustomEventLabel({ item, mobileAppId, viewId }) {
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

const columnDefinitions = [
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

export default function CustomEvents({ timeConfig, tagFilters, mobileAppId, mobileAppLabel }) {
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

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'occurrencesAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}) {
  tagFilters = tagFilters.concat([{ name: 'mobileBeacon.type', stringValue: 'custom', operator: 'EQUALS' }]);
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([
      { name: 'mobileBeacon.customEvent.name', stringValue: query, operator: 'CONTAINS' }
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
        metric: 'uniqueUsers',
        aggregation: 'DISTINCT_COUNT'
      },
      users: {
        metric: 'uniqueUsers',
        aggregation: 'DISTINCT_COUNT',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}
