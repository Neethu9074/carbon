import React, { Fragment } from 'react';

import {
  websiteIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  pageIdUrlParameter
} from 'in-websites/navigation/urlParameters';
import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import LearnMoreUserPointer from 'in-websites/WebsiteDashboard/components/LearnMoreUserPointer';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getWebsiteErrors from 'in-websites/subscriptions/getWebsiteErrors';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getLinkToError, getLinkToAnalyze } from 'in-websites/navigation/paths';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Link from 'in-components/Link';

const columnDefinitions = [
  {
    id: 'errorMessage',
    label: 'Error Message',
    getContent(item, { websiteId, pageId }) {
      return (
        <Link
          href$={getLinkToError(websiteId, {
            pageId,
            errorId: item.error.id
          })}
        >
          {item.error.message}
        </Link>
      );
    }
  },
  {
    id: 'errorsAgg',
    label: 'Occurrences',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.errors}
          metric={item.metrics.errorsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'uniqueUsersAgg',
    label: 'Affected Users',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="DISTINCT_COUNT"
          metrics={item.metrics.uniqueUsers}
          metric={item.metrics.uniqueUsersAgg}
          tooltipFormatter={affectedUsers.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = withEmptyTableState({
  Component: createServerTableWithUrlState({
    paginationResettingUrlParameters: [
      ...timeConfigUrlParameters,
      websiteIdUrlParameter,
      tagFiltersInDashboardUrlParameter,
      pageIdUrlParameter
    ],
    columnDefinitions,
    defaultOrderBy: 'errorsAgg',
    defaultOrderDirection: 'DESC',
    pathSegment: '/errors'
  }),
  columnDefinitions,
  entityName: 'JavaScript errors',
  changeExplanation: (explanation, props) =>
    props.tagFilters && props.tagFilters.length > 1 ? `${explanation}  matching your filters` : explanation
});

export default function Errors({ timeConfig, tagFilters, websiteId, websiteLabel }) {
  const rightHeader = (
    <Button
      kind="secondary"
      href$={getLinkToAnalyze({
        beaconType: 'error',
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters }),
        group: defaultGroupings.error
      })}
      style={{ marginRight: '0.5rem' }}
    >
      Analyze JS Errors
    </Button>
  );

  return (
    <Fragment>
      <LearnMoreUserPointer websiteId={websiteId} />
      <ServerTableWithUrlState
        get={getTableData}
        websiteId={websiteId}
        tagFilters={tagFilters}
        timeConfig={timeConfig}
        rightHeader={rightHeader}
      />
    </Fragment>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'errorsAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}) {
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([{ name: 'beacon.error.message', stringValue: query, operator: 'CONTAINS' }]);
  }

  return getWebsiteErrors({
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
    metrics: {
      uniqueUsersAgg: {
        metric: 'uniqueUsers',
        aggregation: 'DISTINCT_COUNT'
      },
      uniqueUsers: {
        metric: 'uniqueUsers',
        aggregation: 'DISTINCT_COUNT',
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
      }
    }
  });
}
