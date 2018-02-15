import React from 'react';

import { applicationDashboard, getServiceDashboard } from 'in-applications/navigation/paths';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';
import { getSparkChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { ms, percentage, number } from 'in-services/formatters/number';
import getServices from 'in-subscription/application/getServices';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ServerTable from 'in-components/tables/ServerTable';
import Link from 'in-components/Link';

export default function ServiceList({ location, timeframe }) {
  return (
    <MaxWidthFullscreenContainer>
      <ServerTable
        get={getTableData}
        pageSize={10}
        columnDefinitions={columnDefinitions}
        location={location}
        timeframe={timeframe}
      />
    </MaxWidthFullscreenContainer>
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, location, timeframe }) {
  return getServices({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      endpoints: {
        metric: 'endpoints',
        aggregation: 'MEAN'
      },
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
      application: getMatrixParameter(location, applicationDashboard, applicationId),
      service: getMatrixParameter(location, applicationDashboard, serviceId),
      endpoint: getMatrixParameter(location, applicationDashboard, endpointId),
      timeframe
    }
  });
}

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: 'Name',
    getContent(item, { location }) {
      return (
        <Link
          href$={getServiceDashboard(item.service.id, {
            applicationId: getMatrixParameter(location, applicationDashboard, applicationId)
          })}
        >
          {item.service.label}
        </Link>
      );
    }
  },
  {
    id: 'Type',
    getContent(item) {
      return item.service.types.join(', ');
    }
  },
  {
    id: 'endpoints',
    label: 'Endpoints',
    getContent(item) {
      return number.compact(item.metrics.endpoints[0][1]);
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
