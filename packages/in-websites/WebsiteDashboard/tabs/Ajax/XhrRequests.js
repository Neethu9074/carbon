import React from 'react';

import {
  websiteIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  pageIdUrlParameter
} from 'in-websites/navigation/urlParameters';
import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { getLinkToXhrRequest, getLinkToAnalyze } from 'in-websites/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { ms, number, percentage } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Link from 'in-components/Link';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Origin',
    getContent(item, { websiteId, pageId }) {
      let label = item.name;
      try {
        label = String(JSON.parse(label));
      } catch (e) {
        // ignore
      }

      return (
        <Link
          href$={getLinkToXhrRequest(websiteId, {
            xhrId: label,
            pageId
          })}
        >
          {label}
        </Link>
      );
    }
  },
  {
    id: 'beaconCountAgg',
    label: 'Calls',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
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
    label: 'Latency',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
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
    id: 'errorRateAgg',
    label: 'Errors',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.errorRate}
          metric={item.metrics.errorRateAgg}
          tooltipFormatter={percentage.detailed}
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
    defaultOrderBy: 'beaconCountAgg',
    defaultOrderDirection: 'DESC',
    pathSegment: '/ajax'
  }),
  columnDefinitions,
  entityName: 'HTTP requests',
  changeExplanation: (explanation, props) =>
    props.tagFilters && props.tagFilters.length > 2 ? `${explanation}  matching your filters` : explanation
});

export default function XhrRequests({ timeConfig, tagFilters, websiteId, websiteLabel }) {
  const rightHeader = (
    <Button
      kind="secondary"
      href$={getLinkToAnalyze({
        beaconType: 'httpRequest',
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters }),
        group: defaultGroupings.httpRequest
      })}
      style={{ marginRight: '0.5rem' }}
    >
      Analyze HTTP Requests
    </Button>
  );

  tagFilters = tagFilters.concat({ name: 'beacon.type', operator: 'EQUALS', stringValue: 'httpRequest' });

  return (
    <ServerTableWithUrlState
      get={getTableData}
      websiteId={websiteId}
      tagFilters={tagFilters}
      timeConfig={timeConfig}
      rightHeader={rightHeader}
    />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'beaconCountAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}) {
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([{ name: 'beacon.http.origin', stringValue: query, operator: 'CONTAINS' }]);
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
      groupbyTag: 'beacon.http.origin'
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
      errorRateAgg: {
        metric: 'beaconErrorRate',
        aggregation: 'MEAN'
      },
      errorRate: {
        metric: 'beaconErrorRate',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}
