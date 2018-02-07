import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import { applicationId, serviceId } from 'in-applications/navigation/matrix';
import { number, ms, percentage } from 'in-services/formatters/number';
import { serviceDashboard } from 'in-applications/navigation/paths';
import getEndpoints from 'in-subscription/application/getEndpoints';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ServerTable from 'in-components/tables/ServerTable';
import SparkChart from 'in-components/SparkChart';

export default function Endpoints({ location, timeframe, data }) {
  return (
    <MaxWidthFullscreenContainer>
      <ServerTable
        get={getTableData}
        applicationId={getMatrixParameter(location, serviceDashboard, applicationId)}
        serviceId={getMatrixParameter(location, serviceDashboard, serviceId)}
        pageSize={10}
        timeframe={timeframe}
        columnDefinitions={getColumnDefinitions(timeframe, data.label)}
      />
    </MaxWidthFullscreenContainer>
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, applicationId, serviceId, timeframe }) {
  return getEndpoints({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      application: applicationId,
      service: serviceId,
      timeframe
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
    }
  });
}

function getColumnDefinitions(timeframe, serviceLabel) {
  return [
    {
      id: 'endpointLabel',
      label: 'Method',
      getContent(item) {
        return item.endpoint.label;
      }
    },
    {
      id: 'serviceLabel',
      label: 'Service',
      getContent() {
        return serviceLabel;
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
