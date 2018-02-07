import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import SnapshotLink from 'in-components/tables/ServerTable/components/SnapshotLink';
import getInfrastructure from 'in-subscription/application/getInfrastructure';
import { number, ms, percentage } from 'in-services/formatters/number';
import ServerTable from 'in-components/tables/ServerTable';
import SparkChart from 'in-components/SparkChart';

export default function Infrastructure({ applicationId, serviceId, endpointId, timeframe }) {
  return (
    <MaxWidthFullscreenContainer>
      <ServerTable
        get={getTableData}
        pageSize={10}
        columnDefinitions={getColumnDefinitions(timeframe)}
        applicationId={applicationId}
        serviceId={serviceId}
        endpointId={endpointId}
        timeframe={timeframe}
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

function getColumnDefinitions(timeframe) {
  return [
    {
      id: 'process',
      label: 'Process',
      getContent(item) {
        return <SnapshotLink snapshotId={item.physicalContext.process} />;
      }
    },
    {
      id: 'host',
      label: 'Host',
      getContent(item) {
        return <SnapshotLink snapshotId={item.physicalContext.host} />;
      }
    },
    {
      id: 'callsAgg',
      label: 'Calls',
      getContent(item, { result }) {
        return (
          <SparkChart
            timeframe={getResolvedTimeframe(timeframe, result)}
            metrics={item.metrics.calls}
            tooltipFormatter={number.compact}
          />
        );
      }
    },
    {
      id: 'latencyAgg',
      label: 'Latency',
      getContent(item, { result }) {
        return (
          <SparkChart
            timeframe={getResolvedTimeframe(timeframe, result)}
            metrics={item.metrics.latency}
            tooltipFormatter={ms.compact}
          />
        );
      }
    },
    {
      id: 'errorsAgg',
      label: 'Errors',
      getContent(item, { result }) {
        return (
          <SparkChart
            timeframe={getResolvedTimeframe(timeframe, result)}
            metrics={item.metrics.errors}
            tooltipFormatter={percentage.compact}
          />
        );
      }
    }
  ];
}
