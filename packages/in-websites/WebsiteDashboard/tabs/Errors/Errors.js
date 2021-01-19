/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
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
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getLinkToError, getLinkToAnalyze } from 'in-websites/navigation/paths';
import getWebsiteErrors from 'in-websites/subscriptions/getWebsiteErrors';
import changeExplanation from 'in-websites/emptyListExplanation';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Footer from 'in-new-components/Footer';
import Card from 'in-new-components/Card';
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
          loading={result?.progress?.loading}
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
    id: 'uniqueUsersOrSessionsAgg',
    label: 'Affected Users',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="DISTINCT_COUNT"
          metrics={item.metrics.uniqueUsersOrSessions}
          metric={item.metrics.uniqueUsersOrSessionsAgg}
          tooltipFormatter={affectedUsers.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'JavaScript errors',
    changeExplanation
  }),
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
      <Card>
        <ServerTableWithUrlState
          get={getTableData}
          websiteId={websiteId}
          tagFilters={tagFilters}
          timeConfig={timeConfig}
          rightHeader={rightHeader}
        />
      </Card>
      <Footer />
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
      uniqueUsersOrSessionsAgg: {
        metric: 'uniqueUsersOrSessions',
        aggregation: 'DISTINCT_COUNT'
      },
      uniqueUsersOrSessions: {
        metric: 'uniqueUsersOrSessions',
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
