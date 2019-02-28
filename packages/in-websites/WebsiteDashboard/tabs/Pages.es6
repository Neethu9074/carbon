import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-subscription/websiteMonitoring/getWebsitePaginatedBeaconGroups';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import { number, ms } from 'in-services/formatters/number';
import { Row, Col } from 'in-new-components/layout/Grid';
import { isNotBlank } from 'in-services/util/string';
import Link from 'in-components/Link';

export default function Pages({ timeConfig, tagFilters, websiteId }) {
  return (
    <Row>
      <Col xs={12}>
        <ServerTableWithUrlBoundState
          pathSegment="/pages"
          matrixPrefix=""
          get={getTableData}
          websiteId={websiteId}
          tagFilters={tagFilters}
          timeConfig={timeConfig}
          columnDefinitions={columnDefinitions}
          paginationResettingProps={['timeConfig', 'tagFilters']}
          defaultOrderBy="pageLoadsAgg"
          defaultOrderDirection="DESC"
          cardTitle="Pages"
        />
      </Col>
    </Row>
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, timeConfig, query, tagFilters }) {
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([{ name: 'beacon.page.name', stringValue: query, operator: 'CONTAINS' }]);
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
      groupbyTag: 'beacon.page.name'
    },
    metrics: {
      pageLoadsAgg: {
        metric: 'pageLoads',
        aggregation: 'SUM'
      },
      pageLoads: {
        metric: 'pageLoads',
        aggregation: 'SUM',
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
      },
      onLoadTimeAgg: {
        metric: 'onLoadTime',
        aggregation: 'MEAN'
      },
      onLoadTime: {
        metric: 'onLoadTime',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item, { websiteId }) {
      let label = item.name;
      try {
        label = String(JSON.parse(label));
      } catch (e) {
        // ignore
      }

      return (
        <Link
          href$={getLinkToWebsite(websiteId, {
            pageId: label,
            tabPath: '/summary'
          })}
        >
          {label}
        </Link>
      );
    }
  },
  {
    id: 'pageLoadsAgg',
    label: 'Page Views',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.pageLoads}
          metric={item.metrics.pageLoadsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'onLoadTimeAgg',
    label: 'onLoad Time',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.onLoadTime}
          metric={item.metrics.onLoadTimeAgg}
          tooltipFormatter={ms.compact}
        />
      );
    }
  },
  {
    id: 'errorsAgg',
    label: 'JS Errors',
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
  }
];
