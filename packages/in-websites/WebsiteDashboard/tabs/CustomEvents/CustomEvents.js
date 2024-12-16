/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link, Button } from '@instana/components';

import {
  pageIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  websiteIdUrlParameter
} from 'in-websites/navigation/urlParameters';
import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { useCustomEventLink, useLinkToAnalyze } from 'in-websites/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import changeExplanation from 'in-websites/emptyListExplanation';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import { collationLanguage, t } from 'in-i18n';

const CustomEventLabel = ({ item, websiteId, pageId }) => {
  let label = item.name;

  try {
    label = String(JSON.parse(label));
  } catch (e) {
    label = t('in-websites:websiteDashboard.tabs.customEvents.customEventTitleCustomEvent');
  }

  const customEventHref = useCustomEventLink(websiteId, {
    pageId,
    customEventId: label
  });

  return <Link href={customEventHref}>{label}</Link>;
};

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-websites:websiteDashboard.tabs.customEvents.customEventsLabelEventName'),
    getContent: (item, { websiteId, pageId }) => <CustomEventLabel item={item} websiteId={websiteId} pageId={pageId} />
  },
  {
    id: 'occurrencesAgg',
    label: t('in-websites:websiteDashboard.tabs.customEvents.customEventsLabelOccurrences'),
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
    label: t('in-websites:websiteDashboard.tabs.customEvents.customEventsLabelUsers'),
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
    title: t('in-websites:websiteDashboard.noDataAvailable.customEventsTitle'),
    description: t('in-websites:websiteDashboard.noDataAvailable.customEventsDescription'),
    changeExplanation
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    websiteIdUrlParameter,
    tagFiltersInDashboardUrlParameter,
    pageIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'occurrencesAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: '/customEvents'
});

export default function CustomEvents({ timeConfig, tagFilters, websiteId, websiteLabel, pageId }) {
  const tagCatalogCustom = useTagCatalog('custom');

  const analyzeHref = useLinkToAnalyze(
    tagCatalogCustom && {
      beaconType: 'custom',
      formModel: translateDemocratisationTagFiltersToFormModel({
        websiteLabel,
        tagFilters,
        tagCatalog: tagCatalogCustom
      }),
      groupBy: defaultGroupings.custom
    }
  );

  const rightHeader = (
    <Button kind="secondary" href={analyzeHref} style={{ marginRight: '0.5rem' }}>
      {t('in-websites:websiteDashboard.tabs.customEvents.customEventsButtonAnalyzeCustomEvents')}
    </Button>
  );

  return (
    <>
      <ServerTableWithUrlState
        get={getTableData}
        websiteId={websiteId}
        pageId={pageId}
        tagFilters={tagFilters}
        timeConfig={timeConfig}
        cardTitle={t('in-websites:websiteDashboard.tabs.indexLabelCustomEvents')}
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
  tagFilters = tagFilters.concat([{ name: 'beacon.type', stringValue: 'custom', operator: 'EQUALS' }]);
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([{ name: 'beacon.customEvent.name', stringValue: query, operator: 'CONTAINS' }]);
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
      groupbyTag: 'beacon.customEvent.name'
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
