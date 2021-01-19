/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  websiteIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  pageIdUrlParameter
} from 'in-websites/navigation/urlParameters';
import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { getLinkToCustomEvent, getLinkToAnalyze } from 'in-websites/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import changeExplanation from 'in-websites/emptyListExplanation';
import { number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Event Name',
    getContent(item, { websiteId, pageId }) {
      let label = item.name;
      try {
        label = String(JSON.parse(label));
      } catch (e) {
        // ignore
      }

      return (
        <Link
          href$={getLinkToCustomEvent(websiteId, {
            pageId,
            customEventId: label
          })}
        >
          {label}
        </Link>
      );
    }
  },
  {
    id: 'occurrencesAgg',
    label: 'Occurrences',
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
    label: 'Users',
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
    entityName: 'custom events',
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
  const rightHeader = (
    <Button
      kind="secondary"
      href$={getLinkToAnalyze({
        beaconType: 'custom',
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters }),
        group: defaultGroupings.custom
      })}
      style={{ marginRight: '0.5rem' }}
    >
      Analyze Custom Events
    </Button>
  );

  return (
    <Card>
      <ServerTableWithUrlState
        get={getTableData}
        websiteId={websiteId}
        pageId={pageId}
        tagFilters={tagFilters}
        timeConfig={timeConfig}
        rightHeader={rightHeader}
      />
    </Card>
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
      direction: orderDirection
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
