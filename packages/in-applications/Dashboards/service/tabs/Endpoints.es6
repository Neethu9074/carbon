import React from 'react';

import { serviceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import { getSparkChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import { applicationId, serviceId } from 'in-applications/navigation/matrix';
import { getEndpointsLabel } from 'in-applications/endpointTypes';
import { number, ms, percentage } from 'in-services/formatters/number';
import getEndpoints from 'in-subscription/application/getEndpoints';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ServerTable from 'in-components/tables/ServerTable';
import { Row, Col } from 'in-new-components/layout/Grid';
import SparkChart from 'in-components/SparkChart';
import Link from 'in-components/Link';

export default function Endpoints({ location, timeframe, data }) {
  const { types } = data;
  const appId = getMatrixParameter(location, serviceDashboard, applicationId);
  const serviceID = getMatrixParameter(location, serviceDashboard, serviceId);

  if (types.length === 0) {
    return 'No Endpoint types found';
  }
  return types.map(endpointType => (
    <Row key={endpointType}>
      <Col xs={12}>
        <ServerTable
          get={getTableData}
          applicationId={appId}
          serviceId={serviceID}
          endpointType={endpointType}
          serviceLabel={data.label}
          pageSize={10}
          timeframe={timeframe}
          columnDefinitions={columnDefinitions}
          cardTitle={getEndpointsLabel(endpointType)}
        />
      </Col>
    </Row>
  ));
}

function getTableData({ page, pageSize, orderBy, orderDirection, applicationId, serviceId, endpointType, timeframe }) {
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
      endpointTypes: [endpointType],
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

const columnDefinitions = [
  {
    id: 'endpointLabel',
    label: 'Name',
    getContent(item, { applicationId, serviceId }) {
      return (
        <Link href$={getEndpointDashboard(item.endpoint.id, { applicationId, serviceId })}>{item.endpoint.label}</Link>
      );
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
