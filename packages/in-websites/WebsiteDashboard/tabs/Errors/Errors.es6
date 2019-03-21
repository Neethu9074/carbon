import React, { Fragment } from 'react';

import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import LearnMoreUserPointer from 'in-websites/WebsiteDashboard/components/LearnMoreUserPointer';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import getWebsiteErrors from 'in-subscription/websiteMonitoring/getWebsiteErrors';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getLinkToError, getLinkToAnalyze } from 'in-websites/navigation/paths';
import { Row, Col } from 'in-new-components/layout/Grid';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Link from 'in-components/Link';

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

      <Row>
        <Col xs={12}>
          <ServerTableWithUrlBoundState
            pathSegment="/errors"
            matrixPrefix=""
            get={getTableData}
            websiteId={websiteId}
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            columnDefinitions={columnDefinitions}
            cardTitle="JS Errors"
            rightHeader={rightHeader}
            paginationResettingProps={['timeConfig', 'tagFilters']}
            defaultOrderBy="errorsAgg"
            defaultOrderDirection="DESC"
          />
        </Col>
      </Row>
    </Fragment>
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, timeConfig, query, tagFilters }) {
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
