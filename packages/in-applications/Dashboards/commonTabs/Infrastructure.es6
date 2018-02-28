import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import SnapshotLink from 'in-components/tables/ServerTable/components/SnapshotLink';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getInfrastructure from 'in-subscription/application/getInfrastructure';
import { number, ms, percentage } from 'in-services/formatters/number';
import { withoutInstana1Features } from 'in-services/featureFlags';
import ServerTable from 'in-components/tables/ServerTable';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';

export default function Infrastructure({ applicationId, serviceId, endpointId, timeframe }) {
  return (
    <MaxWidthFullscreenContainer>
      <ServerTable
        get={getTableData}
        pageSize={25}
        columnDefinitions={columnDefinitions}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeframe={timeframe}
        paginationResettingProps={{ applicationId, serviceId, endpointId, timeframe }}
      />
    </MaxWidthFullscreenContainer>
  );
}

function getTableData({
  query,
  page,
  pageSize,
  orderBy,
  orderDirection,
  applicationId,
  serviceId,
  endpointId,
  timeframe
}) {
  return getInfrastructure({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeframe)
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeframe)
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeframe)
      }
    },
    filter: {
      label: query,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      timeframe
    }
  });
}

const columnDefinitions = [
  {
    id: 'process',
    label: 'Process',
    getContent(item) {
      if (withoutInstana1Features) {
        return (
          <Tooltip content="Coming soon">
            <Link href="" onClick={e => e.preventDefault()}>
              {item.physicalContext.process.label}
            </Link>
          </Tooltip>
        );
      }
      return <SnapshotLink snapshotPreview={item.physicalContext.process} />;
    }
  },
  {
    id: 'callsAgg',
    label: 'Calls',
    getContent(item, { result, timeframe }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeframe)}
          timeframe={getResolvedTimeframe(timeframe, result)}
          metrics={item.metrics.calls}
          metric={item.metrics.callsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'latencyAgg',
    label: 'Latency',
    getContent(item, { result, timeframe }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeframe)}
          timeframe={getResolvedTimeframe(timeframe, result)}
          metrics={item.metrics.latency}
          metric={item.metrics.latencyAgg}
          tooltipFormatter={ms.compact}
        />
      );
    }
  },
  {
    id: 'errorsAgg',
    label: 'Errors',
    getContent(item, { result, timeframe }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeframe)}
          timeframe={getResolvedTimeframe(timeframe, result)}
          metrics={item.metrics.errors}
          metric={item.metrics.errorsAgg}
          tooltipFormatter={percentage.compact}
        />
      );
    }
  }
];
